import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("partners").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    categoryName: v.string(),
    tag: v.string(),
    location: v.string(),
    benefit: v.string(),
    desc: v.string(),
    rating: v.number(),
    reviews: v.number(),
    phone: v.string(),
    color: v.string(),
    icon: v.string(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("partners", args);
  },
});

export const remove = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
