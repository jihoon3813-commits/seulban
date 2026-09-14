export const BRAND_INFO = {
  name: "슬반생",
  fullName: "슬기로운 반려생활",
  slogan: "우리 아이의 오늘부터 모든 내일까지",
  subSlogan: "등록부터 건강, 여행, 아름다운 이별까지 반려동물의 평생을 함께합니다.",
  phone1: "010-3545-6982",
  phone2: "010-8880-6982",
  email: "contact@seulbanlife.com",
  address: "서울특별시 강남구 테헤란로 123 슬반생 빌딩 5층",
  bizNumber: "123-45-67890",
  mallUrl: "https://mall.seulbanlife.com",

  // === SEO & 사이트 최적화 설정 ===
  // 1. 대표 이미지 (카카오톡, 페이스북 등 SNS 공유 시 1200*630)
  ogImage: "https://res.cloudinary.com/lyjyvy54/image/upload/v1789268626/ChatGPT_Image_2026%EB%85%84_9%EC%9B%94_13%EC%9D%BC_%EC%98%A4%ED%9B%84_12_03_30_6_e9hvro.png",
  // 2. 파비콘 (브라우저 탭 아이콘)
  favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23144A42'><circle cx='12' cy='12' r='10'/><path d='M10 8c0 .5-.3 1-.7 1.3-.4.3-.8.7-.8 1.2 0 .8.7 1.5 1.5 1.5h4c.8 0 1.5-.7 1.5-1.5 0-.5-.4-.9-.8-1.2-.4-.3-.7-.8-.7-1.3' fill='white'/><circle cx='8.5' cy='6.5' r='1.5' fill='white'/><circle cx='15.5' cy='6.5' r='1.5' fill='white'/></svg>",
  // 3. 사이트 메타 타이틀
  siteTitle: "슬반생 | 슬기로운 반려생활 - 동물등록부터 평생케어까지",
  // 4. 사이트 설명 문구 (포털 검색 & 카카오톡 요약)
  siteDescription: "반려동물 평생의 동반자, 슬반생! 모바일 동물등록 3분 완료부터 제휴 병원·펜션 30% 멤버십 혜택, 24시 긴급상담, 안심입양, 장례케어까지 우리 아이의 처음부터 끝까지 함께합니다.",
  // 5. 검색엔진 최적화 키워드
  keywords: "슬반생, 슬기로운반려생활, 동물등록, 강아지등록, 고양이등록, 외장칩, 반려동물등록, 펫케어, 반려동물병원할인, 반려동물여행, 24시동물응급, 안심입양, 반려동물장례",
  // 6. 대표 사이트 URL
  canonicalUrl: "https://www.seulbanlife.com",
  // 7. 검색 로봇 제어
  robots: "index, follow",
  // 8. 작성자 / 소유자
  author: "주식회사 슬기로운 반려생활"
};

// 6 Core Life-Cycle Services
export const CORE_SERVICES = [
  {
    id: "registration",
    title: "동물등록",
    subtitle: "모바일로 3분 만에 끝내는 합법적 동물등록",
    badge: "정부 지정 대행",
    bgClass: "bg-[#144A42] text-white",
    textColor: "text-white",
    subColor: "text-white/80",
    btnColor: "bg-[#C5A880] text-[#144A42] hover:bg-white",
    accent: "bg-[#1A574E]",
    icon: "paw",
    linkText: "신청하기",
  },
  {
    id: "adoption",
    title: "새로운 만남",
    subtitle: "평생을 함께할 가족과의 따뜻하고 책임감 있는 입양",
    badge: "안심 입양",
    bgClass: "bg-[#D8C7B0] text-[#2C241B]",
    textColor: "text-[#2C241B]",
    subColor: "text-[#5C5042]",
    btnColor: "bg-[#144A42] text-white hover:bg-[#0D3832]",
    accent: "bg-[#C7B59D]",
    icon: "heart",
    linkText: "둘러보기",
  },
  {
    id: "travel",
    title: "반려여행",
    subtitle: "반려견 전용 잔디 운동장과 감성 가득 동반 숙소",
    badge: "엄선 숙소",
    bgClass: "bg-[#EFECE6] text-[#242A27]",
    textColor: "text-[#242A27]",
    subColor: "text-[#666D68]",
    btnColor: "bg-white text-[#144A42] hover:bg-[#144A42] hover:text-white",
    accent: "bg-[#E2DDD3]",
    icon: "home",
    linkText: "숙소 찾기",
  },
  {
    id: "life",
    title: "반려생활",
    subtitle: "병원, 미용, 스파, 유치원 등 검증된 라이프스타일 혜택",
    badge: "제휴 할인",
    bgClass: "bg-[#EFECE6] text-[#242A27]",
    textColor: "text-[#242A27]",
    subColor: "text-[#666D68]",
    btnColor: "bg-white text-[#144A42] hover:bg-[#144A42] hover:text-white",
    accent: "bg-[#E2DDD3]",
    icon: "scissors",
    linkText: "혜택 보기",
  },
  {
    id: "medical",
    title: "반려의료",
    subtitle: "24시 야간응급센터 및 슬반생 전문 진료 협력 네트워크",
    badge: "24시 응급",
    bgClass: "bg-[#EFECE6] text-[#242A27]",
    textColor: "text-[#242A27]",
    subColor: "text-[#666D68]",
    btnColor: "bg-white text-[#144A42] hover:bg-[#144A42] hover:text-white",
    accent: "bg-[#E2DDD3]",
    icon: "stethoscope",
    linkText: "병원 찾기",
  },
  {
    id: "farewell",
    title: "아름다운 이별",
    subtitle: "존중과 정성을 담아 마지막 길을 배웅하는 프리미엄 장례 케어",
    badge: "24시 긴급상담",
    bgClass: "bg-[#EFECE6] text-[#242A27]",
    textColor: "text-[#242A27]",
    subColor: "text-[#666D68]",
    btnColor: "bg-white text-[#144A42] hover:bg-[#144A42] hover:text-white",
    accent: "bg-[#E2DDD3]",
    icon: "flower",
    linkText: "상담하기",
  },
];

// Membership 4 Bento Cards (Dark Section)
export const MEMBERSHIP_PERKS = [
  {
    id: "perk1",
    tag: "01 지원",
    title: "동물등록비 전액 지원",
    desc: "신규 등록 대행 수수료 및 프리미엄 외장형 전자칩 목걸이 무료 제공",
    bg: "bg-[#182422] text-white border border-[#2A3B38]",
    tagBg: "bg-[#253A36] text-[#5EEAD4]",
  },
  {
    id: "perk2",
    tag: "02 의료",
    title: "제휴 동물병원 10~20% 할인",
    desc: "전국 슬반생 인증 동물병원 건강검진, 백신, 일반진료 상시 할인",
    bg: "bg-[#EEE7DC] text-[#1D2522]",
    tagBg: "bg-[#DFDACF] text-[#144A42]",
  },
  {
    id: "perk3",
    tag: "03 여행",
    title: "반려 숙소 회원 전용 우대",
    desc: "전국 인기 애견 펜션·리조트 주중 최대 30% 할인 및 웰컴 어메니티",
    bg: "bg-[#EEE7DC] text-[#1D2522]",
    tagBg: "bg-[#DFDACF] text-[#144A42]",
  },
  {
    id: "perk4",
    tag: "04 쇼핑",
    title: "슬반생몰 매월 5만원 쿠폰팩",
    desc: "유기농 프리미엄 사료, 간식, 위생용품 매월 정기 할인 혜택",
    bg: "bg-[#144A42] text-white border border-[#20665B]",
    tagBg: "bg-[#1F6257] text-[#FDE68A]",
  },
];

// Partner Businesses (우리 동네 반려생활)
export const PARTNER_LIST = [
  {
    id: "p1",
    category: "hospital",
    categoryName: "동물병원",
    name: "온유 동물메디컬센터",
    tag: "대학병원급 협력",
    location: "서울 송파구",
    benefit: "진료비 10% 할인",
    desc: "대학병원급 첨단 CT/MRI 장비 보유, 24시 안심 진료 협력 네트워크",
    rating: 4.9,
    reviews: 184,
    phone: "02-555-8275",
    color: "bg-[#DFECF6] text-[#2C4A63]",
    icon: "hospital",
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=700&auto=format&fit=crop&q=80",
    featured: true,
  },
  {
    id: "p2",
    category: "hotel",
    categoryName: "펫호텔",
    name: "포레스트 펫스테이",
    tag: "천연 잔디",
    location: "경기 양평군",
    benefit: "주중 객실 15% 할인",
    desc: "1,000평 천연 잔디 운동장, 전문 케어 매니저 24시 상주 프리미엄 스테이",
    rating: 5.0,
    reviews: 128,
    phone: "031-772-4982",
    color: "bg-[#E0EFE6] text-[#2A5443]",
    icon: "hotel",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&auto=format&fit=crop&q=80",
    featured: true,
  },
  {
    id: "p3",
    category: "grooming",
    categoryName: "미용",
    name: "몽글 그루밍 라운지",
    tag: "1:1 케어",
    location: "서울 마포구",
    benefit: "첫 방문 20% 할인",
    desc: "스트레스 없는 1:1 케어룸, 피부 타입별 천연 아로마 입욕 스파",
    rating: 4.9,
    reviews: 142,
    phone: "02-334-9988",
    color: "bg-[#F8E5E5] text-[#6B3737]",
    icon: "scissors",
    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=700&auto=format&fit=crop&q=80",
    featured: true,
  },
  {
    id: "p4",
    category: "hospital",
    categoryName: "동물병원",
    name: "헤리티지 동물의학연구소",
    tag: "안과/치과 전문",
    location: "서울 송파구 잠실동",
    benefit: "치과 스케일링 & 구강 검진 20% 우대",
    desc: "노령견 맞춤 마취 모니터링 시스템 완비",
    rating: 4.9,
    reviews: 210,
    phone: "02-418-7582",
    color: "bg-[#EBF3FB] text-[#2563EB]",
    icon: "stethoscope",
    imageUrl: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=700&auto=format&fit=crop&q=80",
    featured: false,
  },
];

// Travel Accommodations
export const TRAVEL_LIST = [
  {
    id: "t1",
    type: "리조트",
    name: "숲속의 정원 펫리조트 강촌",
    location: "강원도 춘천시",
    weightLimit: "전 견종 가능 (대형견 환영)",
    price: "180,000원~",
    features: ["500평 인조잔디", "사계절 온수 미온수풀", "바베큐"],
    memberBenefit: "슬반생 회원 주중 20% 추가 할인 + 웰컴간식",
    phone: "033-261-0091",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "t2",
    type: "독채펜션",
    name: "양평 로그하우스 프라이빗 펜션",
    location: "경기도 양평군",
    weightLimit: "15kg 미만 중소형견",
    price: "240,000원~",
    features: ["개별 울타리 마당", "히노끼 펫 스파", "조식 제공"],
    memberBenefit: "인원 및 반려견 추가 요금 1마리 무료",
    phone: "031-773-4554",
    imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "t3",
    type: "글램핑",
    name: "태안 오션뷰 펫 글램핑 포레",
    location: "충청남도 태안군",
    weightLimit: "25kg 이하 가능",
    price: "150,000원~",
    features: ["프라이빗 해변 산책로", "불멍 키트", "반려견 식기구 완비"],
    memberBenefit: "바베큐 숯세트 무료 제공",
    phone: "041-672-8821",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&auto=format&fit=crop&q=80",
  },
];

// Adoption Animals (새로운 만남)
export const ADOPTION_LIST = [
  {
    id: "a1",
    name: "보리",
    breed: "믹스견 (골든두들 믹스)",
    gender: "남아 (중성화 완료)",
    age: "1살 추정",
    weight: "7.2kg",
    center: "한국 동물사랑나눔 보호센터",
    story: "사람을 너무 좋아하고 온순하며, 기본 배변훈련과 앉아 교육이 완료된 사랑스러운 친구입니다.",
    tags: ["애교만점", "사회성 우수", "예방접종 3차"],
    status: "입양 상담 가능",
  },
  {
    id: "a2",
    name: "초코",
    breed: "푸들",
    gender: "여아 (중성화 완료)",
    age: "3살 추정",
    weight: "4.1kg",
    center: "서울 동물복지지원센터",
    story: "조용하고 차분한 성격으로, 실내에서 보호자와 교감하는 것을 가장 행복해합니다.",
    tags: ["털빠짐 적음", "실내견 적합", "건강검진 완료"],
    status: "입양 상담 가능",
  },
  {
    id: "a3",
    name: "망고",
    breed: "코리안 숏헤어",
    gender: "남아 (중성화 완료)",
    age: "8개월",
    weight: "3.5kg",
    center: "경기 반려동물 입양센터",
    story: "골골송을 잘 부르는 개냥이 성격으로, 사람 손길을 매우 좋아합니다.",
    tags: ["개냥이", "호기심 대장", "중성화 완료"],
    status: "입양 상담 가능",
  },
];

// Registration FAQs
export const REG_FAQS = [
  {
    q: "동물등록은 법적으로 꼭 해야 하나요?",
    a: "네, 맞습니다. 동물보호법에 따라 2개월령 이상의 반려견은 지자체에 의무적으로 동물등록을 해야 합니다. 미등록 시 최대 100만 원 이하의 과태료가 부과될 수 있습니다.",
  },
  {
    q: "내장형과 외장형 칩의 차이는 무엇인가요?",
    a: "내장형 칩은 쌀알 크기의 마이크로칩을 피하에 주입하여 영구 분실 위험이 없으며, 외장형은 가벼운 펜던트 목걸이 형태로 착용해 간편하게 등록할 수 있습니다. 슬반생에서는 두 방식 모두 신청 가능합니다.",
  },
  {
    q: "신청 후 동물등록증은 언제 배송되나요?",
    a: "신청서 검수 및 지자체 시스템 등록 승인 후 약 2~3 영업일 이내에 제작 및 우체국 안전택배로 발송되며, 발송 시 송장번호가 문자로 안내됩니다.",
  },
  {
    q: "이사하거나 보호자 연락처가 바뀌면 어떻게 하나요?",
    a: "슬반생 'MY 슬반생' 메뉴 또는 정부 동물보호관리시스템에서 무료로 주소 및 연락처 변경 신청을 하실 수 있습니다.",
  },
];

// Initial Registered Pet (For logged in state demo)
export const INITIAL_PET = {
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
};

// Initial Application Timeline (REG-004)
export const INITIAL_APPLICATION = {
  id: "REG-20260909-0842",
  petName: "코코",
  ownerName: "김슬기",
  phone: "010-9876-5432",
  type: "외장형 인식표 패키지",
  appliedDate: "2026-09-09 14:20",
  statusCode: "COMPLETED", // SUBMITTED, REVIEWING, ACCEPTED, SHIPPING, COMPLETED
  statusLabel: "처리 완료 (배송 완료)",
  trackingNumber: "우체국택배 6089-1234-5678",
  history: [
    { date: "09.09 14:20", title: "신청서 접수 완료", desc: "보호자 및 반려동물 정보 검토 대기" },
    { date: "09.09 16:00", title: "서류 검수 승인", desc: "구청 동물보호 전산망 등록 절차 시작" },
    { date: "09.10 10:30", title: "동물등록 승인 완료", desc: "등록번호(410100012345678) 발급" },
    { date: "09.10 14:00", title: "인식표 제작 및 배송 출발", desc: "우체국택배 6089-1234-5678" },
  ],
};

// Initial Popups List (3:4 ratio promotional popups)
export const INITIAL_POPUPS = [
  {
    id: "pop_01",
    title: "동물등록 원스톱 프로모션",
    imageUrl: "https://res.cloudinary.com/lyjyvy54/image/upload/v1789268626/ChatGPT_Image_2026%EB%85%84_9%EC%9B%94_13%EC%9D%BC_%EC%98%A4%ED%9B%84_12_03_30_1_dxjcu5.png",
    linkUrl: "",
    linkType: "internal", // or external
    internalTab: "registration",
    active: true,
    createdAt: "2026-09-13",
  },
  {
    id: "pop_02",
    title: "슬반생 VIP 멤버십 사전신청",
    imageUrl: "https://res.cloudinary.com/lyjyvy54/image/upload/v1789268626/ChatGPT_Image_2026%EB%85%84_9%EC%9B%94_13%EC%9D%BC_%EC%98%A4%ED%9B%84_12_03_30_6_e9hvro.png",
    linkUrl: "",
    linkType: "internal",
    internalTab: "membership",
    active: true,
    createdAt: "2026-09-13",
  },
];

