import React, { useState } from 'react';
import { HomeIcon, MapPinIcon, HeartIcon, PhoneIcon, CheckIcon, SearchIcon } from '../components/Icons';
import { TRAVEL_LIST } from '../data/mockData';

export default function TravelPage({ travelList = TRAVEL_LIST }) {
  const [filterType, setFilterType] = useState('all');

  const filtered = travelList.filter(t => filterType === 'all' || t.type === filterType);

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">
          PET TRAVEL & RESORTS (TRV-001)
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#144A42] tracking-tight">
          아이와 함께 떠나는<br />행복한 힐링 여행
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6D66]">
          넓은 천연 잔디 운동장부터 전용 수영장까지, 슬반생 회원을 위한 프리미엄 반려견 동반 숙소를 만나보세요.
        </p>
      </div>

      {/* Type Filter Buttons */}
      <div className="flex justify-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
        {['all', '리조트', '독채펜션', '글램핑'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-6 py-2.5 text-xs font-bold transition ${
              filterType === type 
                ? 'bg-[#144A42] text-white shadow-md' 
                : 'bg-[#EFECE6] text-[#4F5C55] hover:bg-[#E3DFD4]'
            }`}
          >
            {type === 'all' ? '전체 숙소' : type}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white overflow-hidden border border-[#EAE4D6] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Photo */}
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                <img 
                  src={
                    item.id === 't1' ? 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&auto=format&fit=crop&q=80' :
                    item.id === 't2' ? 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=700&auto=format&fit=crop&q=80' :
                    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&auto=format&fit=crop&q=80'
                  }
                  alt={item.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1">
                  {item.type}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#144A42] text-xs font-extrabold px-3 py-1 shadow-xs">
                  {item.price}
                </span>
              </div>

              {/* Info */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>{item.location}</span>
                </div>
                <h3 className="text-xl font-bold text-[#142C27]">{item.name}</h3>

                <div className="p-3.5 bg-[#FAF8F5] text-xs space-y-1 border border-[#ECE5D8]">
                  <p className="text-gray-500">동반 조건: <span className="font-semibold text-gray-800">{item.weightLimit}</span></p>
                  <p className="text-[#144A42] font-bold">회원 혜택: {item.memberBenefit}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.features.map((f, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-[#EBF4F2] text-[#144A42] px-2 py-0.5">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`tel:${item.phone}`}
                className="w-full py-3.5 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <PhoneIcon className="w-3.5 h-3.5" />
                <span>숙소 문의 및 우대 예약 ({item.phone})</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
