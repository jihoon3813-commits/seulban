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
    return await ctx.db.query("adoptions").collect();
  },
});

export const add = mutation({
  args: {
    id: v.optional(v.string()),
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
    const cleanArgs = sanitizeDoc(args);
    if (cleanArgs.id) {
      const existing = await ctx.db
        .query("adoptions")
        .withIndex("by_adoption_id", (q) => q.eq("id", cleanArgs.id))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, cleanArgs);
        return existing._id;
      }
    }
    return await ctx.db.insert("adoptions", cleanArgs);
  },
});

export const update = mutation({
  args: {
    id: v.optional(v.string()),
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
    const { id, ...rawUpdates } = args;
    if (!id && !rawUpdates.name) return false;

    const updates = sanitizeDoc(rawUpdates);
    let targetDoc = null;

    if (id) {
      targetDoc = await ctx.db
        .query("adoptions")
        .withIndex("by_adoption_id", (q) => q.eq("id", id))
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
      return await ctx.db.insert("adoptions", {
        id: id || `a_${Date.now()}`,
        name: updates.name || "보호동물",
        breed: updates.breed || "믹스견",
        gender: updates.gender || "",
        age: updates.age || "",
        weight: updates.weight || "",
        center: updates.center || "한국 동물사랑나눔 보호센터",
        story: updates.story || "",
        tags: Array.isArray(updates.tags) ? updates.tags : [],
        status: updates.status || "입양 상담 가능",
        photoUrl: updates.photoUrl || "",
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const byCustomId = await ctx.db
      .query("adoptions")
      .withIndex("by_adoption_id", (q) => q.eq("id", args.id))
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
  args: { adoptions: v.array(v.any()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("adoptions").collect();
    for (const a of existing) {
      await ctx.db.delete(a._id);
    }
    for (const a of args.adoptions) {
      const { _id, _creationTime, ...rawClean } = a;
      const clean = sanitizeDoc(rawClean);
      await ctx.db.insert("adoptions", {
        id: clean.id || `a_${Date.now()}`,
        name: clean.name || "보호동물",
        breed: clean.breed || "믹스견",
        gender: clean.gender || "",
        age: clean.age || "",
        weight: clean.weight || "",
        center: clean.center || "한국 동물사랑나눔 보호센터",
        story: clean.story || "",
        tags: Array.isArray(clean.tags) ? clean.tags : [],
        status: clean.status || "입양 상담 가능",
        photoUrl: clean.photoUrl || "",
      });
    }
    return true;
  },
});

