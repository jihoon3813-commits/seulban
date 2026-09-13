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
    imageUrl: v.optional(v.string()),
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

export const update = mutation({
  args: {
    id: v.id("partners"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    categoryName: v.optional(v.string()),
    tag: v.optional(v.string()),
    location: v.optional(v.string()),
    benefit: v.optional(v.string()),
    desc: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    phone: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return true;
  },
});

