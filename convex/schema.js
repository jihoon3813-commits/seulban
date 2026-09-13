import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 동물등록 신청서 (Applications)
  applications: defineTable({
    id: v.string(), // 접수번호 (예: SB-20260909-0821)
    type: v.string(), // 외장형 무선식별장치 등
    petName: v.string(),
    petBreed: v.optional(v.string()),
    petGender: v.optional(v.string()),
    petBirth: v.optional(v.string()),
    petWeight: v.optional(v.string()),
    ownerName: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    statusCode: v.string(), // SUBMITTED, REVIEWING, ACCEPTED, REGISTERED, SHIPPING, COMPLETED
    statusLabel: v.string(),
    appliedDate: v.string(),
    history: v.optional(v.array(v.object({
      date: v.string(),
      title: v.string(),
      desc: v.string(),
    }))),
  })
    .index("by_app_id", ["id"])
    .index("by_phone", ["phone"])
    .index("by_status", ["statusCode"]),

  // 제휴처 (Partners)
  partners: defineTable({
    name: v.string(),
    category: v.string(), // hospital, grooming, kindergarten, funeral
    categoryName: v.string(),
    tag: v.string(),
    location: v.string(),
    benefit: v.string(),
    desc: v.string(),
    rating: v.number(),
    reviews: v.number(),
    phone: v.string(),
    color: v.string(),
    icon: v.string(),
    featured: v.boolean(),
  }).index("by_category", ["category"]),

  // 안심입양 동물 (Adoption)
  adoptions: defineTable({
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
  }),

  // 반려여행 숙소 (Travel)
  travels: defineTable({
    type: v.string(), // 리조트, 독채펜션, 글램핑
    name: v.string(),
    location: v.string(),
    weightLimit: v.string(),
    price: v.string(),
    features: v.array(v.string()),
    memberBenefit: v.string(),
    phone: v.string(),
  }),

  // 브랜드 및 관리자 설정 (Settings)
  settings: defineTable({
    key: v.string(), // "brand_info" | "admin_security"
    value: v.any(),
  }).index("by_key", ["key"]),
});
