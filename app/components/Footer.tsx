import React from "react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // 修改背景色與邊框，保持深色專業感
    <footer className="w-full bg-[#002855] border-t border-gray-700 text-gray-300 text-xs relative z-0">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* 左側：Logo 與版權 */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 font-bold text-white">
              <div className="relative w-6 h-6">
                {/* 確保你有把 icon.svg 複製到 public/logo.svg */}
                <Image
                  src="/logo.svg"
                  alt="不動產研究中心 Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span>不動產研究中心</span>
            </div>
            <span className="hidden md:inline text-gray-500">|</span>
            <span>&copy; {currentYear} TOD Analysis System.</span>
          </div>

          {/* 右側：免責聲明與版本 (中間的按鈕區塊已移除) */}
          <div className="text-center md:text-right text-[10px] text-gray-400">
            <p>本系統數據僅供學術研究參考，實際交易請以官方資訊為準。</p>
            <p className="font-mono mt-0.5 opacity-60">v1.2.0 beta</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
