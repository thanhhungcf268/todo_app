import React from 'react';
import { HomeIcon, AcademicCapIcon, TrophyIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';

const Duolingo = () => {
  return (
    <div className="flex min-h-screen bg-[#131f24] text-white font-sans">
      
      {/* SIDEBAR LEFT */}
      <div className="w-64 border-r border-[#37464f] p-4 flex flex-col gap-4 fixed h-full">
        <div className="text-[#58cc02] text-3xl font-bold px-4 mb-6">duolingo</div>
        <MenuItem icon={<HomeIcon className="w-7 h-7" />} text="HỌC" active />
        <MenuItem icon={<AcademicCapIcon className="w-7 h-7" />} text="LUYỆN TẬP" />
        <MenuItem icon={<TrophyIcon className="w-7 h-7" />} text="BẢNG XẾP HẠNG" />
        <MenuItem icon={<ShoppingBagIcon className="w-7 h-7" />} text="CỬA HÀNG" />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 mr-80 p-8 flex flex-col items-center">
        {/* Header Unit */}
        <div className="w-full max-w-2xl bg-[#1cb0f6] rounded-xl p-4 mb-12 flex justify-between items-center">
          <div>
            <div className="text-white/70 font-bold text-sm">PHẦN 4, CỬA 1</div>
            <div className="text-xl font-extrabold">Nói về các ngày nghỉ lễ</div>
          </div>
          {/* <button className="bg-white/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border-b-4 border-black/20">
             HƯỚNG DẪN
          </button> */}
        </div>

        {/* Path Nodes (Zig-zag) */}
        <div className="flex flex-col items-center gap-6">
          <Node color="bg-[#ffc800]" />
          <Node color="bg-[#1cb0f6]" translate="translate-x-12" />
          <Node color="bg-[#1cb0f6]" translate="translate-x-20" />
          <Node color="bg-[#1cb0f6]" translate="translate-x-12" />
          <Node color="bg-[#1cb0f6]" />
        </div>
      </main>
      {/* RIGHT SIDEBAR */}
      <div className="w-80 p-8 fixed right-0 h-full overflow-y-auto">
        <section className="bg-[#202f36] border-2 border-[#37464f] rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Giải đấu Hắc Diệu Thạch</h2>
            <span className="text-[#1cb0f6] font-bold text-sm">XEM GIẢI ĐẤU</span>
          </div>
          <div className="text-sm text-gray-400">Bạn đã vào nhóm xuống hạng!</div>
        </section>

        <section className="bg-[#202f36] border-2 border-[#37464f] rounded-2xl p-4">
          <h2 className="font-bold text-lg mb-4">Nhiệm vụ hằng ngày</h2>
          <Quest title="Kiếm 50 KN" progress={100} />
          <Quest title="Hoàn thành 2 bài học" progress={0} />
        </section>
      </div>
    </div>
  );
};

// Components nhỏ bổ trợ
const MenuItem = ({ icon, text, active }) => (
  <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer font-bold transition ${active ? 'bg-[#202f36] border-2 border-[#84d8ff] text-[#84d8ff]' : 'hover:bg-[#202f36]'}`}>
    {icon} <span>{text}</span>
  </div>
);

const Node = ({ color, translate = "" }) => (
  <div className={`w-14 h-14 ${color} rounded-full border-b-8 border-black/20 ${translate}`}></div>
);

const Quest = ({ title, progress }) => (
  <div className="mb-4">
    <div className="text-sm font-bold mb-1">{title}</div>
    <div className="h-4 bg-[#37464f] rounded-full overflow-hidden">
      <div className="h-full bg-[#ffc800]" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export default Duolingo;