import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("travels").collect();
  },
});

export const add = mutation({
  args: {
    type: v.string(),
    name: v.string(),
    location: v.string(),
    weightLimit: v.string(),
    price: v.string(),
    features: v.array(v.string()),
    memberBenefit: v.string(),
    phone: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("travels", args);
  },
});

export const remove = mutation({
  args: { id: v.id("travels") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

export const update = mutation({
  args: {
    id: v.id("travels"),
    type: v.optional(v.string()),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    weightLimit: v.optional(v.string()),
    price: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    memberBenefit: v.optional(v.string()),
    phone: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return true;
  },
});

