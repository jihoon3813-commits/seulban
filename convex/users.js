import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 이메일로 사용자 조회
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// 회원가입 (이메일 또는 구글)
export const register = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    provider: v.string(), // "email" | "google"
    phone: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    isMember: v.optional(v.boolean()),
    membershipLevel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // 이미 가입된 계정인 경우 구글 로그인 시 최신 정보 업데이트
      if (args.provider === "google") {
        await ctx.db.patch(existing._id, {
          name: args.name || existing.name,
          phone: args.phone || existing.phone,
        });
        return { ...existing, name: args.name || existing.name };
      }
      throw new Error("이미 해당 이메일로 가입된 계정이 존재합니다.");
    }

    const newUser = {
      email: args.email,
      name: args.name,
      provider: args.provider,
      phone: args.phone || "",
      passwordHash: args.passwordHash || "",
      isMember: args.isMember ?? true,
      membershipLevel: args.membershipLevel || "VIP 회원",
      createdAt: new Date().toISOString(),
    };

    const id = await ctx.db.insert("users", newUser);
    return { ...newUser, _id: id };
  },
});

// 이메일 로그인 검증
export const login = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("가입되지 않은 이메일 계정입니다.");
    }

    if (user.provider === "email" && user.passwordHash !== args.passwordHash) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    return user;
  },
});
