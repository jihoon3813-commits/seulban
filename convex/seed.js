import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Initial Application
    const existingApps = await ctx.db.query("applications").collect();
    if (existingApps.length === 0) {
      await ctx.db.insert("applications", {
        id: "REG-20260909-0842",
        petName: "코코",
        ownerName: "김슬기",
        phone: "010-9876-5432",
        type: "외장형 인식표 패키지",
        appliedDate: "2026.09.09 14:20",
        statusCode: "COMPLETED",
        statusLabel: "처리 완료 (배송 완료)",
        trackingNumber: "우체국택배 6089-1234-5678",
        history: [
          { date: "09.09 14:20", title: "신청서 접수 완료", desc: "보호자 및 반려동물 정보 검토 대기" },
          { date: "09.09 16:00", title: "서류 검수 승인", desc: "구청 동물보호 전산망 등록 절차 시작" },
          { date: "09.10 10:30", title: "동물등록 승인 완료", desc: "등록번호(410100012345678) 발급" },
          { date: "09.10 14:00", title: "인식표 제작 및 배송 출발", desc: "우체국택배 6089-1234-5678" },
        ],
      });
    }

    // 2. Initial Pet
    const existingPets = await ctx.db.query("pets").collect();
    if (existingPets.length === 0) {
      await ctx.db.insert("pets", {
        id: "pet_01",
        name: "코코",
        breed: "말티푸",
        gender: "남아",
        birth: "2024-03-15",
        weight: "3.8",
        neutered: "완료",
        regNumber: "410100012345678",
        status: "등록 완료",
        photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
        ownerPhone: "010-9876-5432",
      });
    }
    return true;
  },
});
