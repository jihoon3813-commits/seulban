import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pets").order("desc").first();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pets").order("desc").collect();
  },
});

export const save = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    breed: v.string(),
    gender: v.string(),
    birth: v.string(),
    weight: v.optional(v.string()),
    neutered: v.optional(v.string()),
    regNumber: v.string(),
    status: v.string(),
    photoUrl: v.optional(v.string()),
    ownerPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pets")
      .withIndex("by_reg_number", (q) => q.eq("regNumber", args.regNumber))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert("pets", args);
    }
  },
});
