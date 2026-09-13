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
