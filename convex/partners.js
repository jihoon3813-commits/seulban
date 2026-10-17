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
    id: v.optional(v.string()),
    name: v.string(),
    category: v.string(),
    partnerType: v.optional(v.string()),
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
    shopUrl: v.optional(v.string()),
    discountRate: v.optional(v.number()),
    products: v.optional(v.any()),
    features: v.optional(v.array(v.string())),
    bankInfo: v.optional(v.any()),
    images: v.optional(v.array(v.string())),
    isVisible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Check if partner with same id already exists
    if (args.id) {
      const existing = await ctx.db
        .query("partners")
        .withIndex("by_partner_id", (q) => q.eq("id", args.id))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, args);
        return existing._id;
      }
    }
    return await ctx.db.insert("partners", args);
  },
});

export const update = mutation({
  args: {
    id: v.optional(v.string()),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    partnerType: v.optional(v.string()),
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
    shopUrl: v.optional(v.string()),
    discountRate: v.optional(v.number()),
    products: v.optional(v.any()),
    features: v.optional(v.array(v.string())),
    bankInfo: v.optional(v.any()),
    images: v.optional(v.array(v.string())),
    isVisible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    if (!id && !updates.name) return false;

    let targetDoc = null;
    if (id) {
      // 1. Try find by custom id
      targetDoc = await ctx.db
        .query("partners")
        .withIndex("by_partner_id", (q) => q.eq("id", id))
        .first();

      // 2. Try find by Convex _id
      if (!targetDoc) {
        try {
          targetDoc = await ctx.db.get(id);
        } catch {
          // not a valid Convex _id
        }
      }
    }

    if (targetDoc) {
      await ctx.db.patch(targetDoc._id, updates);
      return targetDoc._id;
    } else {
      // Upsert as new partner if not found
      return await ctx.db.insert("partners", {
        id: id || `p_${Date.now()}`,
        name: updates.name || "제휴처",
        category: updates.category || "hospital",
        ...updates,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // 1. Try by custom id
    const byCustomId = await ctx.db
      .query("partners")
      .withIndex("by_partner_id", (q) => q.eq("id", args.id))
      .first();
    if (byCustomId) {
      await ctx.db.delete(byCustomId._id);
      return true;
    }

    // 2. Try by Convex _id
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
  args: { partners: v.array(v.any()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("partners").collect();
    for (const p of existing) {
      await ctx.db.delete(p._id);
    }
    for (const p of args.partners) {
      const { _id, _creationTime, ...clean } = p;
      await ctx.db.insert("partners", {
        name: clean.name || "제휴처",
        category: clean.category || "hospital",
        ...clean,
      });
    }
    return true;
  },
});
