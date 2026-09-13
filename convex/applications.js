import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 모든 신청 내역 조회 (최신순)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const apps = await ctx.db.query("applications").order("desc").collect();
    return apps;
  },
});

// 특정 번호의 신청 내역 조회
export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("applications")
      .withIndex("by_app_id", (q) => q.eq("id", args.id))
      .first();
  },
});

// 동물등록 신규 접수 (Mutation)
export const submit = mutation({
  args: {
    id: v.string(),
    type: v.string(),
    petName: v.string(),
    petBreed: v.optional(v.string()),
    petGender: v.optional(v.string()),
    petBirth: v.optional(v.string()),
    petWeight: v.optional(v.string()),
    ownerName: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newApp = {
      ...args,
      statusCode: "SUBMITTED",
      statusLabel: "접수 완료",
      appliedDate: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      history: [
        {
          date: "방금 전",
          title: "접수 완료",
          desc: "온라인 동물등록 신청서가 정상 접수되었습니다.",
        },
      ],
    };
    const id = await ctx.db.insert("applications", newApp);
    return id;
  },
});

// 상태 변경 (관리자 전용)
export const updateStatus = mutation({
  args: {
    id: v.string(),
    statusCode: v.string(),
    statusLabel: v.string(),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db
      .query("applications")
      .withIndex("by_app_id", (q) => q.eq("id", args.id))
      .first();

    if (!app) {
      throw new Error("해당 접수건을 찾을 수 없습니다.");
    }

    const updatedHistory = [
      {
        date: "방금 전",
        title: `상태 변경: ${args.statusLabel}`,
        desc: "관리자 콘솔에서 변경 처리되었습니다.",
      },
      ...(app.history || []),
    ];

    await ctx.db.patch(app._id, {
      statusCode: args.statusCode,
      statusLabel: args.statusLabel,
      history: updatedHistory,
    });

    return true;
  },
});
