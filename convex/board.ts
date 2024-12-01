import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const imagesPath = "/emptyBoards";

export const create = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User not found");
    }

    const randomImage = Math.floor(Math.random() * 6) + 1;

    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: `${imagesPath}/${randomImage}.png`,
    });

    return board;
  },
});

export const remove = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not found");
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error("Board not found");
    }
    if (board.authorId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const favouriteBoards = await ctx.db.query("favouriteBoards").withIndex("byBoard", (q) => q.eq("boardId", args.id)).collect();
    for (const favouriteBoard of favouriteBoards) {
      await ctx.db.delete(favouriteBoard._id);
    }

    try {
      await ctx.db.delete(args.id);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete board");
    }
  },
});

export const update = mutation({
    args: {
        id: v.id("boards"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
        throw new Error("User not found");
        }
    
        const board = await ctx.db.get(args.id);
        if (!board) {
        throw new Error("Board not found");
        }
        if (board.authorId !== identity.subject) {
        throw new Error("Unauthorized");
        }

        if(args.title.length > 50) {
            throw new Error("Title should be less than 50 characters");
        }
    
        try {
        await ctx.db.patch(args.id, {
            title: args.title,
        });
        } catch (error) {
        console.error(error);
        throw new Error("Failed to update board");
        }
    },
});

export const addFavourite = mutation({
  args: {
    boardId: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User not found");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const existingFavourite = await ctx.db.query("favouriteBoards")
                                    .withIndex("byUserBoardOrg",(q)=>
                                        q.eq("userId", identity.subject)
                                         .eq("boardId", args.boardId)
                                         .eq("orgId", args.orgId)
                                    )
                                    .first(); 
    
    if(existingFavourite){
        throw new Error("Board already favourited");
    }

    await ctx.db.insert("favouriteBoards", {
      boardId: args.boardId,
      userId: identity.subject,
      orgId: args.orgId,
    });
  },
})

export const removeFavourite = mutation({
  args: {
    boardId: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User not found");
    }

    const existingFavourite = await ctx.db.query("favouriteBoards")
                                    .withIndex("byUserBoardOrg",(q)=>
                                        q.eq("userId", identity.subject)
                                         .eq("boardId", args.boardId)
                                         .eq("orgId", args.orgId)
                                    )
                                    .first(); 
    
    if(!existingFavourite){
        throw new Error("Board not favourited");
    }

    await ctx.db.delete(existingFavourite._id);
  },
})

export const getBoard = query({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error("Board not found");
    }
    return board;
  },
});