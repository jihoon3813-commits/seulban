import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("adoptions").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    breed: v.string(),
    gender: v.string(),
    age: v.string(),
    weight: v.string(),
    center: v.string(),
    story: v.string(),
    tags: v.array(v.string()),
    status: v.string(),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("adoptions", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("adoptions"),
    name: v.optional(v.string()),
    breed: v.optional(v.string()),
    gender: v.optional(v.string()),
    age: v.optional(v.string()),
    weight: v.optional(v.string()),
    center: v.optional(v.string()),
    story: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return true;
  },
});

export const remove = mutation({
  args: { id: v.id("adoptions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
