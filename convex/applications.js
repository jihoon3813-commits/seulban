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
    petPhoto: v.optional(v.string()),
    petBreed: v.optional(v.string()),
    petGender: v.optional(v.string()),
    petBirth: v.optional(v.string()),
    petWeight: v.optional(v.string()),
    ownerName: v.string(),
    phone: v.string(),
    ownerEmail: v.optional(v.string()),
    address: v.optional(v.string()),
    shippingAddress: v.optional(v.string()),
    statusCode: v.optional(v.string()),
    statusLabel: v.optional(v.string()),
    appliedDate: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    history: v.optional(v.array(v.object({
      date: v.string(),
      title: v.string(),
      desc: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const newApp = {
      ...args,
      statusCode: args.statusCode || "SUBMITTED",
      statusLabel: args.statusLabel || "접수 완료 (검수 대기)",
      appliedDate: args.appliedDate || new Date().toLocaleString("ko-KR"),
      trackingNumber: args.trackingNumber || "검수 후 발송 준비 예정",
      history: args.history || [
        {
          date: "방금 전",
          title: "온라인 신청서 접수",
          desc: "담당자 검수 대기 중입니다.",
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

// 신청서 상세 정보 전체 수정 (관리자 전용)
export const update = mutation({
  args: {
    id: v.string(), // 접수번호
    ownerName: v.optional(v.string()),
    phone: v.optional(v.string()),
    ownerEmail: v.optional(v.string()),
    address: v.optional(v.string()),
    shippingAddress: v.optional(v.string()),
    petName: v.optional(v.string()),
    petPhoto: v.optional(v.string()),
    petBreed: v.optional(v.string()),
    petGender: v.optional(v.string()),
    petBirth: v.optional(v.string()),
    petWeight: v.optional(v.string()),
    type: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    statusCode: v.optional(v.string()),
    statusLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const app = await ctx.db
      .query("applications")
      .withIndex("by_app_id", (q) => q.eq("id", id))
      .first();

    if (!app) {
      throw new Error("해당 접수건을 찾을 수 없습니다.");
    }

    await ctx.db.patch(app._id, updates);
    return true;
  },
});

// 삭제 (관리자 전용)
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const app = await ctx.db
      .query("applications")
      .withIndex("by_app_id", (q) => q.eq("id", args.id))
      .first();

    if (app) {
      await ctx.db.delete(app._id);
      return true;
    }
    return false;
  },
});



