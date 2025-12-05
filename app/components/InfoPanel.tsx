"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  MapPin,
  Home,
  DollarSign,
  Activity,
  ExternalLink,
  TrendingUp,
  Award,
  Footprints,
  Bike,
  Network,
  Bus,
  ShoppingBag,
  Building2,
  MapPinned,
  CarFront,
} from "lucide-react";
import { StationData } from "../types/mrt";

// 雷達圖標籤對應圖示
const getRadarIcon = (subject: string) => {
  if (subject.includes("步行")) return Footprints;
  if (subject.includes("自行車")) return Bike;
  if (subject.includes("街道")) return Network;
  if (subject.includes("運輸")) return Bus;
  if (subject.includes("生活")) return ShoppingBag;
  if (subject.includes("密度")) return Building2;
  if (subject.includes("整合")) return MapPinned;
  if (subject.includes("汽車")) return CarFront;
  return Activity;
};

// 🔥 修正型別定義
interface StationDetails {
  score: number; // TOD整體分數
  count: number | null;
  price: number | null;
  radar: Array<{
    subject: string;
    value: number; // 標準化數值 (0-1)
  }>;
  raw: {
    // 原始數據
    步行友善度: number;
    自行車便利度: number;
    街道連通度: number;
    大眾運輸可達度: number;
    生活機能多樣性: number;
    都市密度強度: number;
    區域整合度: number;
    低汽車依賴度: number;
  };
  normalized: {
    // 標準化數據 (0-1)
    步行友善度: number;
    自行車便利度: number;
    街道連通度: number;
    大眾運輸可達度: number;
    生活機能多樣性: number;
    都市密度強度: number;
    區域整合度: number;
    低汽車依賴度: number;
  };
}

interface StationInfo extends StationData {
  todValue: string | number;
  priceValue: string | number;
  customScore: number;
  rank?: number;
}

interface InfoPanelProps {
  stationInfo: StationInfo | null;
  stationDetails: StationDetails | null;
}

// 🔥 多線轉乘站對應表（根據優先順序：藍>綠>橘>紅>棕）
const MULTI_LINE_STATIONS: Record<string, string> = {
  // 台北車站：紅R10 / 藍BL12 → 選藍線
  台北車站: "BL12",
  台北車: "BL12",

  // 西門：紅R11 / 藍BL11 / 綠G12 → 選藍線
  西門: "BL11",

  // 忠孝新生：藍BL14 / 橘O07 → 選藍線
  忠孝新生: "BL14",

  // 忠孝復興：藍BL15 / 綠G16 / 棕BR10 → 選藍線
  忠孝復興: "BL15",

  // 南港展覽館：藍BL23 / 棕BR24 → 選藍線
  南港展覽館: "BL23",

  // 古亭：綠G09 / 橘O05 → 選綠線
  古亭: "G09",

  // 中正紀念堂：紅R08 / 綠G10 → 選綠線
  中正紀念堂: "G10",

  // 南京復興：綠G16 / 棕BR11 → 選綠線
  南京復興: "G16",

  // 松江南京：綠G15 / 橘O08 → 選綠線
  松江南京: "G15",

  // 中山：紅R11 / 綠G14 → 選綠線
  中山: "G14",

  // 東門：紅R07 / 橘O06 → 選橘線
  東門: "R07",

  // 民權西路：紅R13 / 橘O11 → 選橘線
  民權西路: "O11",

  // 大安：紅R05 / 棕BR09 → 選紅線
  大安: "R05",
};

// 🔥 生成捷運站資訊連結（處理多線轉乘站）
const getStationInfoUrl = (stationId: string, stationName: string): string => {
  // 先檢查是否為多線轉乘站
  if (MULTI_LINE_STATIONS[stationName]) {
    return `https://taiwanhelper.com/taipeiMetro/station/${MULTI_LINE_STATIONS[stationName]}`;
  }

  // 如果不是多線站，直接使用原始 ID
  return `https://taiwanhelper.com/taipeiMetro/station/${stationId}`;
};

// 🔥 生成房價資訊連結
const getPriceInfoUrl = (stationName: string): string => {
  // 移除「站」字
  const cleanName = stationName.replace("站", "");
  // URL encode 站名
  const encodedName = encodeURIComponent(`${cleanName}站`);
  return `https://buy.yungching.com.tw/mrt/%E5%8F%B0%E5%8C%97%E5%B8%82-_c/?kw=${encodedName}`;
};

export default function InfoPanel({
  stationInfo,
  stationDetails,
}: InfoPanelProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(
      price
    );
  };

  // 如果沒有選擇站點
  if (!stationInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <MapPin className="w-8 h-8" />
        </div>
        <p className="text-gray-500 font-medium text-lg">請選擇站點</p>
        <p className="text-sm text-gray-400 mt-2">
          點擊地圖上的捷運站圓點
          <br />
          查看詳細 TOD 分析資料
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right duration-300">
      {/* 站點標題 */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {stationInfo.name}
        </h3>
        <div className="flex gap-2">
          {/* 🔥 捷運站資訊連結（處理多線站點） */}
          <a
            href={getStationInfoUrl(stationInfo.id, stationInfo.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#003d82] hover:text-[#0056b3] hover:underline transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            捷運站資訊
          </a>
          {/* 🔥 房價資訊連結 */}
          <a
            href={getPriceInfoUrl(stationInfo.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#c8102e] hover:text-[#a00d25] hover:underline transition-colors"
          >
            <Home className="w-3 h-3" />
            查看房價
          </a>
        </div>
      </div>

      {stationDetails ? (
        <>
          {/* 資訊卡片區 */}
          <div className="space-y-3 mb-4">
            {/* TOD 指數 */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">TOD 指數</span>
                </div>
                <div className="text-2xl font-bold text-[#003d82]">
                  {stationDetails.score.toFixed(1)}
                </div>
              </div>
            </div>

            {/* 自訂指標排名 */}
            {stationInfo.rank && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">自訂指標排名</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#c8102e]">
                      #{stationInfo.rank}
                    </div>
                    <div className="text-xs text-gray-500">
                      分數: {stationInfo.customScore.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 交易量和平均單價 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">交易量</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {stationDetails.count !== null &&
                  stationDetails.count !== undefined
                    ? stationDetails.count
                    : "N/A"}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    件
                  </span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">平均單價</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {stationDetails.price !== null &&
                  stationDetails.price !== undefined
                    ? formatPrice(stationDetails.price / 10000)
                    : "N/A"}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    萬/坪
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 雷達圖和指標列表 */}
          {stationDetails.radar && (
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#003d82]" />
                各項指標表現
              </h4>

              {/* 🔥 雷達圖 - 使用標準化數據 */}
              <div
                className="w-full mb-4"
                style={{ height: "240px", minHeight: "240px" }}
              >
                <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={stationDetails.radar.filter(
                      (item: any) => !isNaN(item.value)
                    )}
                  >
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#6b7280", fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 1]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name={stationInfo.name}
                      dataKey="value"
                      stroke="#003d82"
                      strokeWidth={2}
                      fill="#0056b3"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* 🔥 指標列表 - 使用標準化數據顯示百分比 */}
              <div className="space-y-2">
                {stationDetails.radar
                  .filter((item: any) => !isNaN(item.value))
                  .map((item: any, index: number) => {
                    const IconComponent = getRadarIcon(item.subject);
                    const percentage = (item.value * 100).toFixed(0);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                      >
                        <IconComponent className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">
                              {item.subject}
                            </span>
                            <span className="text-xs font-bold text-[#003d82]">
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#003d82] h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 bg-yellow-50 text-yellow-700 text-sm rounded-lg">
          尚無此範圍詳細數據
        </div>
      )}
    </div>
  );
}
