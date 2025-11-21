"use client";

import React, { useState, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// 導入類型與資料
import { StationData } from "../types/mrt";
import { STATIONS } from "../data/stations";
import { TOD_DATA } from "../data/todData";
import { TOD_DETAILS } from "../data/todDetails"; // 新增：詳細資料
import { LINES, getLineColor } from "../data/lines";

// 導入圖示
import {
  Calendar,
  ChevronDown,
  Filter,
  MapPin,
  Train,
  Home,
  DollarSign,
  Activity,
} from "lucide-react";

// --- 單個站點元件 (保持不變) ---
interface StationNodeProps {
  station: StationData;
  todValue: number | string;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: (station: StationData) => void;
}

const StationNode: React.FC<StationNodeProps> = ({
  station,
  todValue,
  isSelected,
  isDimmed,
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

  const labelPosition = station.labelPosition || "bottom";
  const getLabelOffset = () => {
    if (station.labelOffset) return station.labelOffset;
    const verticalOffset = 28;
    const horizontalOffset = 28;
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
      style={{
        cursor: "pointer",
        opacity: isDimmed ? 0.1 : 1,
        transition: "opacity 0.3s ease-in-out",
      }}
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

// --- 自定義 Select 元件 (保持不變) ---
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; subLabel?: string }>;
  icon?: React.ReactNode;
  label: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  icon,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 mb-1 ml-1">
        {icon}
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-40 h-10 px-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-blue-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
      >
        <span className="text-sm font-medium text-gray-700 truncate">
          {selectedOption?.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex flex-col ${
                  value === option.value
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "border-l-4 border-transparent"
                }`}
              >
                <span className="text-sm font-medium text-gray-700">
                  {option.label}
                </span>
                {option.subLabel && (
                  <span className="text-xs text-gray-400 mt-0.5">
                    {option.subLabel}
                  </span>
                )}
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
  const [selectedBuffer, setSelectedBuffer] = useState<string>("300");
  const [selectedLine, setSelectedLine] = useState<string>("all");

  const yearOptions = [
    { value: "112", label: "112 年度", subLabel: "2023" },
    { value: "111", label: "111 年度", subLabel: "2022" },
    { value: "110", label: "110 年度", subLabel: "2021" },
  ];

  const bufferOptions = [
    { value: "150", label: "150 公尺", subLabel: "步行約 2-3 分鐘" },
    { value: "300", label: "300 公尺", subLabel: "步行約 4-5 分鐘" },
  ];

  const lineOptions = [
    { value: "all", label: "所有路線", subLabel: "顯示全路網" },
    ...LINES.map((line) => ({
      value: line.id,
      label: line.name,
      subLabel: line.id,
    })),
  ];

  // 在 MrtMap.tsx 中修改這個函數
  const getTodValue = (stationId: string) => {
    // 找到站點資訊
    const station = STATIONS.find((s) => s.id === stationId);
    if (!station) return "-";

    // 使用站名（去掉「站」字）查詢
    const stationName = station.name.replace("站", "");

    // 🔥 新的查詢邏輯：使用 "年份_環域" 作為 key
    const key = `${selectedYear}_${selectedBuffer}`;
    const value = TOD_DATA[stationName]?.[key];

    return value !== undefined ? value.toFixed(1) : "-";
  };

  const handleStationClick = (station: StationData) => {
    setSelectedStationId(station.id);
  };

  // 取得當前選中站點的詳細 TOD 資料
  // 在 MrtMap.tsx 中修改這個 useMemo
  const currentDetails = useMemo(() => {
    if (!selectedStationId) return null;

    // 找到站點資訊
    const station = STATIONS.find((s) => s.id === selectedStationId);
    if (!station) return null;

    // 使用站名（去掉「站」字）查詢
    const stationName = station.name.replace("站", "");

    // 🔥 新的查詢邏輯：年份 → 環域
    const details = TOD_DETAILS[stationName]?.[selectedYear]?.[selectedBuffer];

    return details || null;
  }, [selectedStationId, selectedYear, selectedBuffer]); // 🔥 加入 selectedYear 依賴

  const currentStationInfo = useMemo(() => {
    if (!selectedStationId) return null;
    const station = STATIONS.find((s) => s.id === selectedStationId);
    const value = getTodValue(station?.id ?? "");
    return station ? { ...station, value: String(value) } : null;
  }, [selectedStationId, selectedYear, selectedBuffer]);

  const checkStationInLine = (station: StationData, lineId: string) => {
    if (lineId === "all") return true;

    // ✅ 現在可以安全使用 lines 屬性了
    if (station.lines && station.lines.includes(lineId)) {
      return true;
    }

    if (station.id.startsWith(lineId)) return true;
    return false;
  };

  // 格式化價格
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(
      price
    );
  };

  return (
    <div className="relative w-full h-full max-w-[1369px] mx-auto bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* 右上角控制面板 */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 flex flex-col gap-4">
          <CustomSelect
            label="資料年度"
            icon={<Calendar className="w-3.5 h-3.5" />}
            value={selectedYear}
            onChange={setSelectedYear}
            options={yearOptions}
          />
          <div className="w-full h-px bg-gray-100" />
          <CustomSelect
            label="環域範圍"
            icon={<MapPin className="w-3.5 h-3.5" />}
            value={selectedBuffer}
            onChange={setSelectedBuffer}
            options={bufferOptions}
          />
          <div className="w-full h-px bg-gray-100" />
          <CustomSelect
            label="捷運路線"
            icon={<Train className="w-3.5 h-3.5" />}
            value={selectedLine}
            onChange={setSelectedLine}
            options={lineOptions}
          />
        </div>
      </div>

      {/* 左上角資訊面板 */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 z-10 w-[320px] overflow-hidden flex flex-col max-h-[calc(100%-2rem)]">
        <div className="p-5 border-b border-gray-100">
          {/* <h3 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-2 flex items-center gap-2">
            <Filter className="w-3 h-3" />
            站點分析
          </h3> */}

          {currentStationInfo ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-end mb-4">
                <div className="text-3xl font-black text-gray-800">
                  {currentStationInfo.name + "站"}
                </div>
                {/* <div className="text-xs text-gray-400 font-mono mb-1">
                  {currentStationInfo.id}
                </div> */}
              </div>

              {/* 關鍵指標卡片 */}
              {currentDetails ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="col-span-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                      {/* <Activity className="w-3.5 h-3.5" /> */}
                      <span className="text-xs font-bold">TOD 指數</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-700 font-mono">
                      {currentDetails.score != null
                        ? currentDetails.score.toFixed(1)
                        : "N/A"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      {/* <Home className="w-3.5 h-3.5" /> */}
                      <span className="text-xs font-bold">交易量</span>
                    </div>
                    <div className="text-xl font-bold text-gray-700 font-mono">
                      {currentDetails.count != null
                        ? currentDetails.count
                        : "N/A"}{" "}
                      <span className="text-xs font-normal text-gray-400">
                        件
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      {/* <DollarSign className="w-3.5 h-3.5" /> */}
                      <span className="text-xs font-bold">平均單價</span>
                    </div>
                    <div className="text-xl font-bold text-gray-700 font-mono">
                      {currentDetails.price != null
                        ? formatPrice(currentDetails.price / 10000)
                        : "N/A"}{" "}
                      <span className="text-xs font-normal text-gray-400">
                        萬/坪
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 text-yellow-700 text-sm rounded-lg mb-4">
                  尚無此範圍詳細數據
                </div>
              )}

              {/* 雷達圖 */}
              {currentDetails && (
                <div className="w-full h-[240px] -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      data={currentDetails.radar}
                    >
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 1]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name={currentStationInfo.name}
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="#3b82f6"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-gray-500 font-medium">請選擇站點</p>
              <p className="text-xs text-gray-400 mt-1">
                點擊地圖圓點查看詳細 TOD 分析
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 右下角圖例 */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 z-10">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider border-b border-gray-100 pb-1">
          捷運路線圖例
        </h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {LINES.map((line) => (
            <div
              key={line.id}
              className={`flex items-center gap-2 transition-opacity duration-300 ${
                selectedLine !== "all" && selectedLine !== line.id
                  ? "opacity-30"
                  : "opacity-100"
              }`}
            >
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

      {/* SVG 地圖 - 修改這裡！ */}
      <svg
        version="1.1"
        width="100%"
        height="100%"
        viewBox="0 0 1369.9617919921875 1104.26025390625"
        className="w-full h-full"
        onClick={() => setSelectedStationId(null)}
      >
        <g fill="none" strokeWidth="10" style={{ pointerEvents: "none" }}>
          {/* 淡水信義線 (紅線 R) */}
          <path
            // d="m 59.710902 103.2889 h 405 c 75 0 75 0 75 75 v 570 h 525"
            d="m 250.710902 103.2889 h 215 c 75 0 75 0 75 75 v 570 h 525"
            stroke="#d12d33"
            style={{
              opacity:
                selectedLine === "all" || selectedLine === "R" ? 1 : 0.15,
              transition: "opacity 0.3s ease-in-out",
            }}
          />

          {/* 板南線 (藍線 BL) */}
          <path
            // d="m 89.7109 943.2889 l 280 -280 c 15 -15 25 -15 55 -15 h 800"
            d="m 369.7109 663.2889 l 10 -5 c 15 -15 25 -15 55 -15 h 800"
            stroke="#0072c6"
            style={{
              opacity:
                selectedLine === "all" || selectedLine === "BL" ? 1 : 0.15,
              transition: "opacity 0.3s ease-in-out",
            }}
          />

          {/* 松山新店線 (綠線 G) */}
          <path
            // d="m 1069.7109 553.2889 h -605 c -17.59453 0 -40 22.40547 -40 40 v 125 c 0 14.26086 15.73915 30 30 30 h 85 l 110 110 c 7.35863 7.35863 15 18.39002 15 25 v 220"
            d="m 1069.7109 553.2889 h -605 c -17.59453 0 -40 22.40547 -40 40 v 125 c 0 14.26086 15.73915 30 30 30 h 85 l 110 110 c 7.35863 7.35863 15 18.39002 15 25 v 80"
            stroke="#007c59"
            style={{
              opacity:
                selectedLine === "all" || selectedLine === "G" ? 1 : 0.15,
              transition: "opacity 0.3s ease-in-out",
            }}
          />

          {/* 中和新蘆線 (橘線 O) */}
          <g
            stroke="#fca311"
            style={{
              opacity:
                selectedLine === "all" || selectedLine === "O" ? 1 : 0.15,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <path d="m 592 800 l 52 -50 v -270 c 0 -20 -10 -30 -30 -30 h -180" />
            {/* <path d="m 409.7109 983.28889 l 235 -234.99999 v -270 c 0 -20 -10 -30 -30 -30 h -180 l -365 365" /> */}
            {/* <path d="M 434.73522,447.69034 209.7109,223.2889" /> */}
          </g>

          {/* 文湖線 (棕線 BR) */}
          <path
            d="m 1174.7109 943.2889 h -360.00008 c -34.28884 0 -59.99992 -40.71114 -59.99992 -75 v -445 c 0 -50 0 -50 55 -50 h 370 c 45 0 45 0 45 45 v 230"
            stroke="#aa753f"
            style={{
              opacity:
                selectedLine === "all" || selectedLine === "BR" ? 1 : 0.15,
              transition: "opacity 0.3s ease-in-out",
            }}
          />

          {/* 環狀線 (黃線 Y) */}
          {/* <path
            d="m 664.7109 1023.2889 h -45"
            stroke="#cce226"
            style={{
              opacity:
                selectedLine === "all" || selectedLine === "Y" ? 1 : 0.15,
              transition: "opacity 0.3s ease-in-out",
            }}
          /> */}

          {/* 其他輔助線段 */}
          <path
            d="m 449.7109 103.2889 v -49.999998"
            stroke="#f98e99"
            style={{
              opacity: selectedLine === "all" ? 1 : 0.15,
              transition: "opacity 0.3s ease-in-out",
            }}
          />
        </g>

        {/* {STATIONS.map((station) => {
          const val = getTodValue(station.id);
          const isDimmed = !checkStationInLine(station, selectedLine);
          return (
            <StationNode
              key={station.id}
              station={station}
              todValue={val}
              isSelected={selectedStationId === station.id}
              isDimmed={isDimmed}
              onClick={handleStationClick}
            />
          );
        })} */}
        {STATIONS.map((station) => {
          const val = getTodValue(station.id);
          const isDimmed = !checkStationInLine(station, selectedLine);

          // 🔥 檢查是否有任何年份/環域的資料
          const stationName = station.name.replace("站", "");
          const hasAnyData = TOD_DATA[stationName] !== undefined;

          // 🔥 如果沒有資料，不渲染這個站點
          if (!hasAnyData) return null;

          return (
            <StationNode
              key={station.id}
              station={station}
              todValue={val}
              isSelected={selectedStationId === station.id}
              isDimmed={isDimmed}
              onClick={handleStationClick}
            />
          );
        })}
      </svg>
    </div>
  );
}
