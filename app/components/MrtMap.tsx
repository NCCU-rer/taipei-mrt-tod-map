"use client";

import React, { useState, useMemo } from "react";

// 導入類型定義
import { StationData } from "../types/mrt";

// 導入資料
import { STATIONS } from "../data/stations";
import { TOD_DATA } from "../data/todData";
import { LINES, getLineColor } from "../data/lines";

// 導入圖示
import { Calendar, ChevronDown } from "lucide-react";

// --- 單個站點元件 ---
interface StationNodeProps {
  station: StationData;
  todValue: number | string;
  isSelected: boolean;
  onClick: (station: StationData) => void;
}

const StationNode: React.FC<StationNodeProps> = ({
  station,
  todValue,
  isSelected,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const lineColor = getLineColor(station.id);
  const hasData = todValue !== "-";
  const radius = hasData ? 15 : 12;

  const fill = hasData ? "#ffffff" : "#f0f0f0";
  const stroke = isSelected ? "#000" : lineColor;
  const strokeWidth = isSelected ? 3 : 2.5;

  const textColor = isSelected ? "#000" : "#555";
  const fontWeight = isSelected ? "bold" : "normal";

  const displayValue = todValue;
  const valueColor = hasData ? "#333" : "#999";

  // 根據 labelPosition 計算站名位置（支援自定義偏移量）
  const labelPosition = station.labelPosition || "bottom";
  const getLabelOffset = () => {
    // 如果有自定義偏移量，直接使用
    if (station.labelOffset) {
      return station.labelOffset;
    }

    // 否則使用預設偏移量
    const verticalOffset = 28; // 上下偏移
    const horizontalOffset = 28; // 左右偏移

    switch (labelPosition) {
      case "top":
        return { x: 0, y: -verticalOffset };
      case "bottom":
        return { x: 0, y: verticalOffset };
      case "left":
        return { x: -horizontalOffset, y: 0 };
      case "right":
        return { x: horizontalOffset, y: 0 };
      case "bottom-right":
        return { x: horizontalOffset * 0.7, y: verticalOffset * 0.7 };
      default:
        return { x: 0, y: verticalOffset };
    }
  };

  const labelOffset = getLabelOffset();
  const textAnchor =
    labelPosition === "left"
      ? "end"
      : labelPosition === "right" || labelPosition === "bottom-right"
      ? "start"
      : "middle";

  return (
    <g
      transform={`translate(${station.x}, ${station.y})`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(station);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <circle r={25} fill="transparent" />
      <circle
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{
          filter:
            isSelected || isHovered
              ? "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
              : "none",
          transition: "all 0.2s ease-out",
          transform: isHovered ? "scale(1.1)" : "scale(1)",
        }}
      />
      <text
        dy=".35em"
        fill={valueColor}
        fontSize={hasData ? "11" : "14"}
        fontWeight="900"
        textAnchor="middle"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {displayValue}
      </text>
      <text
        x={labelOffset.x}
        y={labelOffset.y}
        dy={
          labelPosition === "left" || labelPosition === "right" ? ".35em" : "0"
        }
        fill={textColor}
        fontSize={14}
        fontFamily="Noto Sans CJK TC Regular"
        fontWeight={fontWeight}
        textAnchor={textAnchor}
        style={{
          pointerEvents: "none",
          textShadow: "0px 0px 4px rgba(255,255,255,0.9)",
          userSelect: "none",
        }}
      >
        {station.name}
      </text>
    </g>
  );
};

// --- 自定義 Select 元件 ---
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; year: string }>;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-32 h-9 px-3 bg-white border border-gray-300 rounded-md flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
      >
        <span className="text-sm font-medium text-gray-700">
          {selectedOption?.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-xl z-20 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors flex items-center justify-between ${
                  value === option.value ? "bg-blue-50" : ""
                }`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {option.label}
                </span>
                <span className="text-xs text-gray-500">({option.year})</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- 主元件 ---
export default function MrtMap() {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string>("112");

  const handleStationClick = (station: StationData) => {
    setSelectedStationId(station.id);
  };

  const currentStationInfo = useMemo(() => {
    if (!selectedStationId) return null;
    const station = STATIONS.find((s) => s.id === selectedStationId);
    const value = TOD_DATA[station?.id ?? ""]?.[selectedYear] ?? "-";
    return station ? { ...station, value } : null;
  }, [selectedStationId, selectedYear]);

  // 年份選項資料
  const yearOptions = [
    { value: "112", label: "112 年度", year: "2023" },
    { value: "111", label: "111 年度", year: "2022" },
    { value: "110", label: "110 年度", year: "2021" },
  ];

  return (
    <div className="relative w-full h-full max-w-[1369px] mx-auto bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* 1. 優化後的年份選擇控制列 */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">資料年度</span>
            </div>
            <CustomSelect
              value={selectedYear}
              onChange={setSelectedYear}
              options={yearOptions}
            />
          </div>
        </div>
      </div>

      {/* 2. 資訊面板 (左上) */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-100 z-10 min-w-[220px]">
        <h3 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-2">
          站點資訊
        </h3>
        {currentStationInfo ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-3xl font-black text-gray-800 mb-1">
              {currentStationInfo.name}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500 font-medium">
                TOD 指數 ({selectedYear}年)
              </span>
              <span
                className={`text-2xl font-bold font-mono ${
                  currentStationInfo.value === "-"
                    ? "text-gray-400"
                    : "text-blue-600"
                }`}
              >
                {currentStationInfo.value}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
              <span>ID: {currentStationInfo.id}</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 italic text-sm py-2">
            點擊地圖圓點查看數據
          </div>
        )}
      </div>

      {/* 3. 優化後的圖例 (Legend) - 右下角浮動面板 */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 z-10">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider border-b border-gray-100 pb-1">
          捷運路線圖例
        </h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {LINES.map((line) => (
            <div key={line.id} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: line.color }}
              ></span>
              <span className="text-sm text-gray-700 font-medium">
                {line.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG 地圖 */}
      <svg
        version="1.1"
        width="100%"
        height="100%"
        viewBox="0 0 1369.9617919921875 1104.26025390625"
        className="w-full h-full"
        onClick={() => setSelectedStationId(null)}
      >
        {/* Layer 1: 原始 SVG 背景 */}
        <g fill="none" strokeWidth="10" style={{ pointerEvents: "none" }}>
          <path d="m 449.7109 103.2889 v -49.999998" stroke="#f98e99" />
          <path d="m 664.7109 1023.2889 h -45" stroke="#cce226" />
          <path
            d="m 1069.7109 553.2889 h -605 c -17.59453 0 -40 22.40547 -40 40 v 125 c 0 14.26086 15.73915 30 30 30 h 85 l 110 110 c 7.35863 7.35863 15 18.39002 15 25 v 220"
            stroke="#007c59"
          />
          <path
            d="m 59.710902 103.2889 h 405 c 75 0 75 0 75 75 v 570 h 525"
            stroke="#d12d33"
          />
          <path
            d="m 89.7109 943.2889 l 280 -280 c 15 -15 25 -15 55 -15 h 800"
            stroke="#0072c6"
          />
          <path
            d="m 1174.7109 943.2889 h -360.00008 c -34.28884 0 -59.99992 -40.71114 -59.99992 -75 v -445 c 0 -50 0 -50 55 -50 h 370 c 45 0 45 0 45 45 v 230"
            stroke="#aa753f"
          />
          <g stroke="#fca311">
            <path d="m 409.7109 983.28889 l 235 -234.99999 v -270 c 0 -20 -10 -30 -30 -30 h -180 l -365 365" />
            <path d="M 434.73522,447.69034 209.7109,223.2889" />
          </g>
        </g>

        {/* Layer 2: 互動站點層 */}
        {STATIONS.map((station) => {
          const val = TOD_DATA[station.id]?.[selectedYear] ?? "-";
          return (
            <StationNode
              key={station.id}
              station={station}
              todValue={val}
              isSelected={selectedStationId === station.id}
              onClick={handleStationClick}
            />
          );
        })}
      </svg>
    </div>
  );
}
