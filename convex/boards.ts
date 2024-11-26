import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
    args: {
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        const boards = await ctx.db.query("boards")
                        .withIndex("byOrgId", (q) => q.eq("orgId", args.orgId))
                        .order("desc")
                        .collect();

        return boards;
    }
})