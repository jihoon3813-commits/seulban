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
    return await ctx.db.query("travels").collect();
  },
});

export const add = mutation({
  args: {
    id: v.optional(v.string()),
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
    const cleanArgs = sanitizeDoc(args);
    if (cleanArgs.id) {
      const existing = await ctx.db
        .query("travels")
        .withIndex("by_travel_id", (q) => q.eq("id", cleanArgs.id))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, cleanArgs);
        return existing._id;
      }
    }
    return await ctx.db.insert("travels", cleanArgs);
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const byCustomId = await ctx.db
      .query("travels")
      .withIndex("by_travel_id", (q) => q.eq("id", args.id))
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
      // ignore invalid _id format
    }
    return false;
  },
});

export const update = mutation({
  args: {
    id: v.optional(v.string()),
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
    const { id, ...rawUpdates } = args;
    if (!id && !rawUpdates.name) return false;

    const updates = sanitizeDoc(rawUpdates);
    let targetDoc = null;

    if (id) {
      targetDoc = await ctx.db
        .query("travels")
        .withIndex("by_travel_id", (q) => q.eq("id", id))
        .first();

      if (!targetDoc) {
        try {
          targetDoc = await ctx.db.get(id);
        } catch {
          // ignore
        }
      }
    }

    if (targetDoc) {
      await ctx.db.patch(targetDoc._id, updates);
      return targetDoc._id;
    } else {
      return await ctx.db.insert("travels", {
        id: id || `t_${Date.now()}`,
        type: updates.type || "리조트",
        name: updates.name || "반려숙소",
        location: updates.location || "",
        weightLimit: updates.weightLimit || "전 견종 가능",
        price: updates.price || "",
        features: Array.isArray(updates.features) ? updates.features : [],
        memberBenefit: updates.memberBenefit || "",
        phone: updates.phone || "",
        ...updates,
      });
    }
  },
});

export const syncAll = mutation({
  args: { travels: v.array(v.any()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("travels").collect();
    for (const t of existing) {
      await ctx.db.delete(t._id);
    }
    for (const t of args.travels) {
      const { _id, _creationTime, ...rawClean } = t;
      const clean = sanitizeDoc(rawClean);
      await ctx.db.insert("travels", {
        id: clean.id || `t_${Date.now()}`,
        type: clean.type || "리조트",
        name: clean.name || "반려숙소",
        location: clean.location || "",
        weightLimit: clean.weightLimit || "전 견종 가능",
        price: clean.price || "",
        features: Array.isArray(clean.features) ? clean.features : [],
        memberBenefit: clean.memberBenefit || "",
        phone: clean.phone || "",
        imageUrl: clean.imageUrl || "",
      });
    }
    return true;
  },
});


