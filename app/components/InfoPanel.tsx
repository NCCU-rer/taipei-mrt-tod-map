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

interface StationDetails {
  score?: number;
  count?: number;
  price?: number | null | undefined;
  radar?: Array<{
    subject: string;
    value: number;
  }>;
  raw?: Record<string, any>;
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
          <a
            href={`https://www.metro.taipei/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#003d82] hover:text-[#0056b3] hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            捷運站資訊
          </a>
          <a
            href={`https://yungching.housefun.com.tw/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#c8102e] hover:text-[#a00d25] hover:underline"
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
                  {stationDetails.score?.toFixed(1) ?? "N/A"}
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
                      分數: {(stationInfo.customScore * 100).toFixed(1)}
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
                  {stationDetails.count ?? "N/A"}
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
                  {stationDetails.price
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

              {/* 雷達圖 */}
              <div className="w-full h-[240px] -ml-2 mb-4">
                <ResponsiveContainer width="100%" height="100%">
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

              {/* 指標列表 */}
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
