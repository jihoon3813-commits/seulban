import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return item ? item.value : null;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("settings").collect();
    const map = {};
    for (const item of items) {
      map[item.key] = item.value;
    }
    return map;
  },
});

export const set = mutation({
  args: { key: v.string(), value: v.any() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("settings", { key: args.key, value: args.value });
    }
    return true;
  },
});

export const syncAllSettings = mutation({
  args: { settings: v.record(v.string(), v.any()) },
  handler: async (ctx, args) => {
    for (const [key, value] of Object.entries(args.settings)) {
      if (value !== undefined) {
        const existing = await ctx.db
          .query("settings")
          .withIndex("by_key", (q) => q.eq("key", key))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, { value });
        } else {
          await ctx.db.insert("settings", { key, value });
        }
      }
    }
    return true;
  },
});
