"use client";

import { useEffect, useState } from "react";
import { X, BarChart3, Footprints, Bike, GitBranch, Train, ShoppingBag, Building2, Globe, Car } from "lucide-react";

interface MethodModalProps {
    onClose: () => void;
}

const INDICATORS = [
    { icon: Footprints, label: "步行友善度", desc: "站點周邊的步行道完整性、行人空間品質與步行連結條件。" },
    { icon: Bike, label: "自行車便利度", desc: "YouBike 站點密度與自行車道覆蓋，反映非機動車輛的便利性。" },
    { icon: GitBranch, label: "街道連通度", desc: "道路網格的交叉口密度，越高代表選路彈性越好、步行環境越友善。" },
    { icon: Train, label: "大眾運輸可達度", desc: "捷運與公車路線密度及班次頻率，衡量換乘與接駁的便利程度。" },
    { icon: ShoppingBag, label: "生活機能多樣性", desc: "商業、餐飲、醫療、教育等日常設施的種類與數量豐富程度。" },
    { icon: Building2, label: "都市密度強度", desc: "人口密度與建築量體，密度高代表土地使用效率佳，支持公共運輸發展。" },
    { icon: Globe, label: "區域整合度", desc: "站點在路網中的中心性與可達性，反映該站在都市空間中的連結位置。" },
    { icon: Car, label: "低汽車依賴度", desc: "停車場密度的反向指標；停車設施越少，代表該區域越不依賴私人汽車。" },
];

export default function MethodModal({ onClose }: MethodModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    // ESC to close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(4px)",
                transition: "opacity 0.3s ease",
                opacity: visible ? 1 : 0,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                style={{
                    maxHeight: "90vh",
                    transition: "transform 0.3s cubic-bezier(0.34,1.4,0.64,1), opacity 0.3s ease",
                    transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
                    opacity: visible ? 1 : 0,
                }}
            >
                {/* ── STICKY HEADER ────────────────────────── */}
                <div className="flex-shrink-0 bg-[#003d82] px-7 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-blue-200 flex-shrink-0" />
                        <h2 className="text-white font-bold text-base leading-tight">
                            分數背後的邏輯
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        aria-label="關閉"
                        className="p-2 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── SCROLLABLE BODY ───────────────────────── */}
                <div className="overflow-y-auto flex-1">
                    <div className="px-7 py-7 space-y-7">

                        {/* Subtitle */}
                        <h3 className="text-[#003d82] font-bold text-lg leading-snug">
                            如何定義好的捷運生活圈？
                        </h3>

                        {/* Intro paragraphs */}
                        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                            <p>
                                本網站參考大眾運輸導向發展（TOD, Transit-Oriented Development）理念，
                                從站點周邊的生活條件出發，將捷運生活圈分為<strong className="text-gray-800">八大指標</strong>進行觀察。
                                這套架構參考國際 TOD 評估概念，並結合臺北地區的都市特性與 TOD 政策方向，
                                將原本較專業的研究方法，轉譯為一般民眾也能直覺理解的生活圈指標。
                            </p>
                            <p>
                                一個「好的捷運生活圈」，不只是離捷運站近而已，而是同時具備幾個特徵：
                                走路方便、轉乘順暢、日常機能完整、街道環境友善，並且在不依賴汽車的情況下，
                                也能維持便利的日常生活。
                            </p>
                            <p>
                                為了讓不同站點之間可以比較，本網站先整理站點周邊在各面向的相關資料，
                                再將這些資料轉換為可比較的分數。因此，TOD 指數並不是由單一資料決定，
                                而是多個生活條件整合後的結果。
                            </p>
                            <p>
                                由於各類資料的型態並不相同（有些是距離、有些是密度、有些是設施數量），
                                在計算時會先將不同資料轉換為可比較的相對尺度，再整合為各面向的表現，
                                最後形成站點周邊的 TOD 指數。這個指數反映的是一個站點在整體生活圈條件上的
                                <strong className="text-gray-800">相對表現</strong>，而不是單一設施或單一優勢的高低。
                            </p>
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-100" />

                        {/* 8 indicators */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                八大指標
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {INDICATORS.map(({ icon: Icon, label, desc }) => (
                                    <div
                                        key={label}
                                        className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/40 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#003d82]/10 flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-[#003d82]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800 mb-0.5">{label}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-100" />

                        {/* 2 range zones */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                為什麼觀察兩種範圍？
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* 150m */}
                                <div className="rounded-xl border-2 border-[#003d82]/20 overflow-hidden">
                                    <div className="bg-[#003d82] px-5 py-3 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                                            <span className="text-white font-black text-sm">150</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">公尺</p>
                                            <p className="text-blue-200 text-xs">近站核心圈</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50/40 px-5 py-4">
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            反映出站後立即可及的環境條件，是觀察捷運出口周邊步行、
                                            轉乘與近站機能表現的重要範圍。
                                        </p>
                                    </div>
                                </div>

                                {/* 300m */}
                                <div className="rounded-xl border-2 border-cyan-500/20 overflow-hidden">
                                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 px-5 py-3 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                                            <span className="text-white font-black text-sm">300</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">公尺</p>
                                            <p className="text-cyan-100 text-xs">步行生活圈</p>
                                        </div>
                                    </div>
                                    <div className="bg-cyan-50/40 px-5 py-4">
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            反映一般人短距步行可及的生活範圍，約為 4 至 5 分鐘步行距離，
                                            更能代表住在站點周邊時的生活便利性與機能完整度。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom note */}
                        <div className="bg-gray-50 rounded-xl px-5 py-4 text-xs text-gray-500 leading-relaxed border border-gray-100">
                            💡 本網站的TOD指數僅供比較參考，數值高低代表相對條件的優劣，無絕對好壞之分。
                            實際居住體驗仍需結合個人需求與實地走訪。
                        </div>

                    </div>
                </div>

                {/* ── FOOTER ───────────────────────────────── */}
                <div className="flex-shrink-0 px-7 py-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 bg-[#003d82] text-white text-sm font-semibold rounded-lg hover:bg-[#00306a] active:scale-95 transition-all duration-150"
                    >
                        了解了，開始探索
                    </button>
                </div>
            </div>
        </div>
    );
}
