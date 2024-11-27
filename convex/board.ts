import { v } from "convex/values";
import { mutation } from "./_generated/server";

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

    try {
      await ctx.db.delete(args.id);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete board");
    }
  },
});
