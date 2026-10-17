import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 동물등록 신청서 (Applications)
  applications: defineTable({
    id: v.string(), // 접수번호 (예: REG-20260913-1234)
    type: v.string(), // 외장형 안심 목걸이 칩, 내장형 마이크로칩 시술권 등
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
    statusCode: v.string(), // SUBMITTED, REVIEWING, ACCEPTED, REGISTERED, SHIPPING, COMPLETED
    statusLabel: v.string(),
    appliedDate: v.string(),
    trackingNumber: v.optional(v.string()),
    history: v.optional(v.array(v.object({
      date: v.string(),
      title: v.string(),
      desc: v.string(),
    }))),
  })
    .index("by_app_id", ["id"])
    .index("by_phone", ["phone"])
    .index("by_status", ["statusCode"]),

  // 등록 반려동물 프로필 (Pets)
  pets: defineTable({
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
    ownerEmail: v.optional(v.string()),
    ownerName: v.optional(v.string()),
  })
    .index("by_pet_id", ["id"])
    .index("by_reg_number", ["regNumber"])
    .index("by_owner_email", ["ownerEmail"]),

  // 제휴처 (Partners)
  partners: defineTable({
    id: v.optional(v.string()), // 'p_redpuppy', 'p_01' 등 클라이언트 고유 식별자
    partnerType: v.optional(v.string()), // 'shop', 'normal' 등
    name: v.string(),
    category: v.string(), // hospital, grooming, kindergarten, funeral, cafe, shopping, hotel 등
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
  })
    .index("by_category", ["category"])
    .index("by_partner_id", ["id"]),

  // 안심입양 동물 (Adoption)
  adoptions: defineTable({
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
  }).index("by_adoption_id", ["id"]),

  // 반려여행 숙소 (Travel)
  travels: defineTable({
    id: v.optional(v.string()),
    type: v.string(), // 리조트, 독채펜션, 글램핑
    name: v.string(),
    location: v.string(),
    weightLimit: v.string(),
    price: v.string(),
    features: v.array(v.string()),
    memberBenefit: v.string(),
    phone: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_travel_id", ["id"]),

  // 팝업 관리 (Popups - 3:4 비율)
  popups: defineTable({
    id: v.optional(v.string()),
    title: v.string(),
    imageUrl: v.string(),
    linkType: v.string(), // none, url, internal
    linkUrl: v.optional(v.string()),
    internalTab: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.optional(v.string()),
  }).index("by_popup_id", ["id"]),

  // 브랜드 및 관리자 설정 (Settings)
  settings: defineTable({
    key: v.string(), // "brand_info" | "admin_security"
    value: v.any(),
  }).index("by_key", ["key"]),

  // 회원 사용자 (Users) - 이메일 및 구글 가입
  users: defineTable({
    email: v.string(),
    name: v.string(),
    provider: v.string(), // "email" | "google"
    phone: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    isMember: v.boolean(),
    membershipLevel: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_email", ["email"]),
});

