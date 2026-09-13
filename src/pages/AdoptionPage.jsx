import React, { useState } from 'react';
import { HeartIcon, MapPinIcon, ShieldCheckIcon, ArrowRight, CheckIcon } from '../components/Icons';
import { ADOPTION_LIST } from '../data/mockData';
import { formatPhoneNumber } from '../components/Modals';

export default function AdoptionPage({ adoptionList = ADOPTION_LIST }) {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [applicant, setApplicant] = useState({
    name: '',
    phone: '',
    housing: '아파트',
    hasPetExperience: '있음',
    notes: ''
  });

  const handleApply = (animal) => {
    setSelectedAnimal(animal);
    setConsultSubmitted(false);
    setConsultModalOpen(true);
  };

  const submitConsult = (e) => {
    e.preventDefault();
    setConsultSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* Top Banner Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-8">
        <div className="w-full overflow-hidden shadow-xs border border-[#E5DFD1]">
          <img
            src="https://res.cloudinary.com/lyjyvy54/image/upload/v1789268626/ChatGPT_Image_2026%EB%85%84_9%EC%9B%94_13%EC%9D%BC_%EC%98%A4%ED%9B%84_12_03_30_2_qclzso.png"
            alt="새로운 만남 안심 입양 배너"
            className="w-full h-auto object-cover max-h-[220px] sm:max-h-[400px]"
          />
        </div>
      </div>

      <div className="py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#B48B55] uppercase">
            WARM ADOPTION (ADP-001)
          </span>
          <h1 className="text-2xl sm:text-5xl font-extrabold text-[#144A42] tracking-tight leading-tight">
            새로운 만남,<br />따뜻한 가족이 되어주세요
          </h1>
          <p className="text-[11px] sm:text-sm text-[#61706A] leading-relaxed">
            슬반생은 지자체 공인 보호센터와 협력하여 건강검진 및 기초 훈련을 마친 아이들의 안심 입양을 지원합니다. 사지 말고 입양하세요.
          </p>
        </div>

        {/* Adoption Animals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-16">
          {adoptionList.map((pet) => (
            <div key={pet.id} className="bg-white overflow-hidden border border-[#ECE5D8] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Pet Photo */}
                <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img 
                    src={
                      pet.photoUrl || (
                        pet.id === 'a1' ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700&auto=format&fit=crop&q=80' :
                        pet.id === 'a2' ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&auto=format&fit=crop&q=80' :
                        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=700&auto=format&fit=crop&q=80'
                      )
                    }
                    alt={pet.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#144A42] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1">
                    {pet.status}
                  </span>
                </div>

                {/* Pet Info */}
                <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-xl font-bold text-[#142C27]">{pet.name}</h3>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#828F89]">{pet.breed}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {pet.tags.map((t, idx) => (
                      <span key={idx} className="text-[9px] sm:text-[10px] font-semibold bg-[#F4F1EA] text-[#55635D] px-1.5 py-0.5 sm:px-2 sm:py-0.5">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="bg-[#FAF9F6] p-2.5 sm:p-3.5 text-[11px] sm:text-xs text-[#52605A] space-y-1 border border-[#ECE5D8]">
                    <div className="flex justify-between">
                      <span className="text-gray-400">성별 / 나이</span>
                      <span className="font-semibold">{pet.gender} • {pet.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">체중</span>
                      <span className="font-semibold">{pet.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">보호 센터</span>
                      <span className="font-semibold">{pet.center}</span>
                    </div>
                  </div>

                  <p className="text-[11px] sm:text-xs text-[#63706A] leading-relaxed pt-0.5 line-clamp-2 sm:line-clamp-none">
                    "{pet.story}"
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 sm:p-6 sm:pt-0">
                <button
                  onClick={() => handleApply(pet)}
                  className="w-full py-2.5 sm:py-3.5 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{pet.name} 입양 상담 신청하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Adoption Procedure */}
        <div className="bg-[#FAF8F4] p-4 sm:p-8 border border-[#ECE5D8] max-w-4xl mx-auto">
          <h3 className="text-base sm:text-xl font-bold text-[#144A42] text-center mb-4 sm:mb-6">책임 있는 입양 4원칙</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center text-xs">
            <div className="bg-white p-3 sm:p-5 border border-[#E3DDCF]">
              <span className="font-bold text-[#B48B55] text-xs block mb-0.5">01 상담 신청</span>
              <p className="text-[10px] sm:text-xs text-[#64716B]">입양 희망 설문 확인</p>
            </div>
            <div className="bg-white p-3 sm:p-5 border border-[#E3DDCF]">
              <span className="font-bold text-[#B48B55] text-xs block mb-0.5">02 보호소 방문</span>
              <p className="text-[10px] sm:text-xs text-[#64716B]">대면 직접 교감</p>
            </div>
            <div className="bg-white p-3 sm:p-5 border border-[#E3DDCF]">
              <span className="font-bold text-[#B48B55] text-xs block mb-0.5">03 동물등록 완료</span>
              <p className="text-[10px] sm:text-xs text-[#64716B]">보호자 명의 법적 등록</p>
            </div>
            <div className="bg-white p-3 sm:p-5 border border-[#E3DDCF]">
              <span className="font-bold text-[#B48B55] text-xs block mb-0.5">04 평생 동행</span>
              <p className="text-[10px] sm:text-xs text-[#64716B]">케어 패키지 지원</p>
            </div>
          </div>
        </div>

      {/* Consult Modal */}
      {consultModalOpen && selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md p-6 shadow-2xl border border-[#E8E2D5]">
            <h3 className="text-lg font-bold text-[#144A42] mb-1">
              '{selectedAnimal.name}' 입양 상담 신청
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              담당 보호소 상담원이 검토 후 24시간 이내에 안내 연락을 드립니다.
            </p>

            {!consultSubmitted ? (
              <form onSubmit={submitConsult} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">신청자 성함</label>
                  <input
                    type="text"
                    required
                    value={applicant.name}
                    onChange={(e) => setApplicant({...applicant, name: e.target.value})}
                    placeholder="홍길동"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#144A42]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">연락처</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={13}
                    required
                    value={applicant.phone}
                    onChange={(e) => setApplicant({...applicant, phone: formatPhoneNumber(e.target.value)})}
                    placeholder="010-0000-0000"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#144A42]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">주거 형태</label>
                  <select
                    value={applicant.housing}
                    onChange={(e) => setApplicant({...applicant, housing: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300"
                  >
                    <option value="아파트">아파트</option>
                    <option value="단독주택">마당 있는 단독주택</option>
                    <option value="빌라/오피스텔">빌라 / 오피스텔</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setConsultModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#144A42] text-white font-bold"
                  >
                    상담 접수
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckIcon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#144A42]">상담 신청이 완료되었습니다</h4>
                <p className="text-xs text-gray-600">
                  {applicant.name}님({applicant.phone})께 담당 보호관리원이 곧 연락드리겠습니다.
                </p>
                <button
                  onClick={() => setConsultModalOpen(false)}
                  className="w-full py-2.5 bg-[#144A42] text-white text-xs font-bold mt-2"
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
