import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAllOrThrow } from "convex-helpers/server/relationships"

export const get = query({
    args: {
        orgId: v.string(),
        favorite: v.optional(v.boolean()),
        search: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not found");
        }

        let boards = [];
        if (args.search) {
            boards = await ctx.db.query("boards")
                .withSearchIndex("search_title", (q) => q
                    .search("title", args.search!)
                ).collect();
            boards = await Promise.all(boards.map(async (b) => {
                const favouriteBoard = await ctx.db.query("favouriteBoards")
                    .withIndex("byUserOrgBoard", (q) => q
                        .eq("userId", identity.subject)
                        .eq("orgId", args.orgId)
                        .eq("boardId", b._id)
                    ).collect();
                return {
                    ...b,
                    isFavorite: favouriteBoard.length > 0
                }
            }));

            if (args.favorite) {
                boards = boards.filter((b) => b.isFavorite);
            }

            return boards;
        }

        if(args.favorite){
            let favouriteBoards;
            favouriteBoards = await ctx.db.query("favouriteBoards")
                .withIndex("byUserOrg", (q) => q.eq("userId", identity.subject).eq("orgId", args.orgId))
                .collect();
            const boardIds = favouriteBoards.map((b) => b.boardId);
            if(boardIds.length === 0){
                return [];
            }
            return boards = (await getAllOrThrow(ctx.db, boardIds)).map((b) => ({
                ...b,
                isFavorite: true
                }));
        }else{
            boards = await ctx.db.query("boards")
                        .withIndex("byOrgId", (q) => q.eq("orgId", args.orgId))
                        .order("desc")
                        .collect();
            const boardIdsOrgAndUser = boards.map((b) => ({
                boardId: b._id,
                orgId: args.orgId,
                userId: identity.subject
            }));
            boardIdsOrgAndUser.sort((a, b) => a.boardId.localeCompare(b.boardId));
            if (boardIdsOrgAndUser.length === 0) {
                return boards;
            }
            const favouriteBoards = await ctx.db.query("favouriteBoards")
            .withIndex("byUserOrgBoard", (q) => q
                .eq("userId", identity.subject)
                .eq("orgId", args.orgId)
                .gte("boardId", boardIdsOrgAndUser[0].boardId)
                .lte("boardId", boardIdsOrgAndUser[boardIdsOrgAndUser.length - 1].boardId)
            ).collect();

            const favouriteBoardIdsSet = new Set(favouriteBoards.map((b) => b.boardId));

            return boards.map((b) => ({
                ...b,
                isFavorite: favouriteBoardIdsSet.has(b._id)
            }));
        }
    }
})