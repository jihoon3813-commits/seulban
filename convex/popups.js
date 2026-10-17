import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function sanitizeDoc(doc) {
  if (doc === undefined || doc === null) return null;
  const clean = {};
  for (const [key, value] of Object.entries(doc)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("popups").collect();
  },
});

export const add = mutation({
  args: {
    id: v.optional(v.string()),
    title: v.string(),
    imageUrl: v.string(),
    linkType: v.string(),
    linkUrl: v.optional(v.string()),
    internalTab: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanArgs = sanitizeDoc({
      ...args,
      createdAt: args.createdAt || new Date().toISOString().slice(0, 10),
    });
    if (cleanArgs.id) {
      const existing = await ctx.db
        .query("popups")
        .withIndex("by_popup_id", (q) => q.eq("id", cleanArgs.id))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, cleanArgs);
        return existing._id;
      }
    }
    return await ctx.db.insert("popups", cleanArgs);
  },
});

export const toggleActive = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    let popup = await ctx.db
      .query("popups")
      .withIndex("by_popup_id", (q) => q.eq("id", args.id))
      .first();

    if (!popup) {
      try {
        popup = await ctx.db.get(args.id);
      } catch {
        // ignore
      }
    }

    if (popup) {
      await ctx.db.patch(popup._id, { active: !popup.active });
      return true;
    }
    return false;
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const byCustomId = await ctx.db
      .query("popups")
      .withIndex("by_popup_id", (q) => q.eq("id", args.id))
      .first();
    if (byCustomId) {
      await ctx.db.delete(byCustomId._id);
      return true;
    }

    try {
      const doc = await ctx.db.get(args.id);
      if (doc) {
        await ctx.db.delete(doc._id);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  },
});

export const syncAll = mutation({
  args: { popups: v.array(v.any()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("popups").collect();
    for (const p of existing) {
      await ctx.db.delete(p._id);
    }
    for (const p of args.popups) {
      const { _id, _creationTime, ...rawClean } = p;
      const clean = sanitizeDoc(rawClean);
      await ctx.db.insert("popups", {
        id: clean.id || `pop_${Date.now()}`,
        title: clean.title || "프로모션 팝업",
        imageUrl: clean.imageUrl || "",
        linkType: clean.linkType || "none",
        linkUrl: clean.linkUrl || "",
        internalTab: clean.internalTab || "registration",
        active: clean.active !== false,
        createdAt: clean.createdAt || new Date().toISOString().slice(0, 10),
      });
    }
    return true;
  },
});

