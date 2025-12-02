"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { X, Award, Info, ChevronLeft, ChevronRight } from "lucide-react";

interface RankingData {
  name: string;
  score: number;
  rank: number;
  stationId: string;
  color: string;
  price: string | null;
}

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankingData: RankingData[];
  selectedIndicators: string[];
  indicatorLabels: string[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onBarClick: (data: any) => void;
}

// 自訂 Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="font-bold text-gray-800 mb-2">{data.name}</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">排名：</span>
            <span className="font-bold text-[#c8102e]">#{data.rank}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">綜合分數：</span>
            <span className="font-bold text-[#003d82]">{data.score} 分</span>
          </div>
          {data.price && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">平均單價：</span>
              <span className="font-bold text-green-600">
                {data.price} 萬/坪
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function RankingModal({
  isOpen,
  onClose,
  rankingData,
  selectedIndicators,
  indicatorLabels,
  currentPage,
  totalPages,
  itemsPerPage,
  onPrevPage,
  onNextPage,
  onBarClick,
}: RankingModalProps) {
  if (!isOpen) return null;

  const currentPageData = rankingData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal 內容 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200">
          {/* 標題列 */}
          <div className="p-4 md:p-6 border-b border-gray-200 bg-[#003d82]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">
                    站點排名 (第 {currentPage + 1} / {totalPages} 頁)
                  </h2>
                  <p className="text-xs text-blue-100 mt-1">
                    已選 {selectedIndicators.length} 項 - 點擊長條查看詳情 -
                    Hover 查看分數與房價
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 內容區 */}
          <div
            className="p-3 md:p-6 overflow-y-auto"
            style={{ maxHeight: "calc(95vh - 100px)" }}
          >
            {/* 選定指標說明 */}
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#003d82] mt-0.5 flex-shrink-0" />
                <div className="text-xs md:text-sm text-[#003d82]">
                  <span className="font-bold">選定指標：</span>
                  {indicatorLabels.join("、")}
                </div>
              </div>
            </div>

            {/* 翻頁按鈕 */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onPrevPage}
                disabled={currentPage === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#003d82] text-white hover:bg-[#002d5f]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                上一頁
              </button>

              <span className="text-sm text-gray-600">
                顯示 {currentPage * itemsPerPage + 1} -{" "}
                {Math.min((currentPage + 1) * itemsPerPage, rankingData.length)}{" "}
                / 共 {rankingData.length} 站
              </span>

              <button
                onClick={onNextPage}
                disabled={currentPage >= totalPages - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage >= totalPages - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#003d82] text-white hover:bg-[#002d5f]"
                }`}
              >
                下一頁
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 長條圖 */}
            <div className="w-full h-[400px] md:h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentPageData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    label={{
                      value: "綜合分數",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 12 },
                    }}
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="score"
                    radius={[8, 8, 0, 0]}
                    onClick={onBarClick}
                    cursor="pointer"
                  >
                    {currentPageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
