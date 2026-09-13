import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("popups").collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    imageUrl: v.string(),
    linkType: v.string(),
    linkUrl: v.optional(v.string()),
    internalTab: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("popups", {
      ...args,
      createdAt: args.createdAt || new Date().toISOString().slice(0, 10),
    });
  },
});

export const toggleActive = mutation({
  args: { id: v.id("popups") },
  handler: async (ctx, args) => {
    const popup = await ctx.db.get(args.id);
    if (popup) {
      await ctx.db.patch(args.id, { active: !popup.active });
      return true;
    }
    return false;
  },
});

export const remove = mutation({
  args: { id: v.id("popups") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
