"use client";

import { useState, useEffect } from "react";
import { X, MapPin, CheckCircle, AlertTriangle, ChevronRight } from "lucide-react";

const STORAGE_KEY = "tod-map-welcome-dismissed";

interface WelcomeOverlayProps {
    onClose: () => void;
    onOpenMethod: () => void;
}

export default function WelcomeOverlay({ onClose, onOpenMethod }: WelcomeOverlayProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation after mount
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem(STORAGE_KEY, "1");
        }
        // fade-out
        setVisible(false);
        setTimeout(onClose, 350);
    };

    const handleOpenMethod = () => {
        if (dontShowAgain) {
            localStorage.setItem(STORAGE_KEY, "1");
        }
        onOpenMethod();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                background: "linear-gradient(135deg, rgba(0,20,60,0.82) 0%, rgba(0,61,130,0.75) 60%, rgba(0,30,80,0.80) 100%)",
                backdropFilter: "blur(6px)",
                transition: "opacity 0.35s ease",
                opacity: visible ? 1 : 0,
            }}
        >
            {/* Card */}
            <div
                className="relative w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                style={{
                    transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
                    transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
                    opacity: visible ? 1 : 0,
                }}
            >
                {/* Top accent stripe */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500" />

                <div className="p-7 md:p-9">
                    {/* ── HEADER ───────────────────────────────── */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-1">
                                台北捷運 TOD 生活圈地圖
                            </p>
                            <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
                                看懂捷運站旁，<br className="md:hidden" />哪裡生活更方便
                            </h1>
                        </div>
                    </div>

                    {/* ── INTRO TEXT ───────────────────────────── */}
                    <p className="text-white/80 text-sm leading-relaxed mb-6">
                        本網站將大眾運輸導向發展（TOD, Transit-Oriented Development）的概念，
                        轉換成一般人也能理解的 TOD 指數。TOD 強調以捷運、公車等大眾運輸為核心，
                        提升步行便利、生活機能與整體都市環境品質。<br /><br />
                        你可以透過這張地圖，快速比較不同捷運站周邊的通勤便利、步行環境、生活機能
                        與整體生活圈條件，作為購屋與選擇生活圈的參考工具。
                    </p>

                    {/* ── FEATURES LIST ────────────────────────── */}
                    <div className="mb-5">
                        <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-3">
                            這個網站可以幫你做什麼
                        </p>
                        <ul className="space-y-2">
                            {[
                                "比較不同捷運站周邊的生活圈條件",
                                "快速掌握各站的通勤便利與生活機能特色",
                                "作為購屋與認識都市空間差異的輔助工具",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                                    <CheckCircle className="w-4 h-4 text-cyan-300 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── WARNING BOX ──────────────────────────── */}
                    <div className="flex items-start gap-3 bg-amber-400/15 border border-amber-300/30 rounded-xl px-4 py-3 mb-7">
                        <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-100/90 leading-relaxed">
                            <span className="font-semibold">使用提醒：</span>
                            本網站提供的是站點周邊環境的綜合比較，不代表個別房價高低、投資報酬，
                            或單一社區的實際居住感受。
                        </p>
                    </div>

                    {/* ── BUTTONS ──────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Primary CTA */}
                        <button
                            onClick={handleClose}
                            className="flex-1 flex items-center justify-center gap-2 bg-white text-[#003d82] font-bold text-sm py-3 px-5 rounded-xl hover:bg-blue-50 active:scale-95 transition-all duration-150 shadow-lg shadow-black/20"
                        >
                            開始探索地圖
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        {/* Secondary: method */}
                        <button
                            onClick={handleOpenMethod}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/15 text-white font-semibold text-sm py-3 px-5 rounded-xl hover:bg-white/25 active:scale-95 transition-all duration-150 border border-white/25"
                        >
                            分數怎麼算？
                        </button>
                    </div>

                    {/* ── DONT SHOW AGAIN ──────────────────────── */}
                    <div className="mt-5 flex items-center justify-center gap-2">
                        <button
                            role="checkbox"
                            aria-checked={dontShowAgain}
                            onClick={() => setDontShowAgain(!dontShowAgain)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${dontShowAgain
                                    ? "bg-cyan-400 border-cyan-400"
                                    : "bg-transparent border-white/40 hover:border-white/70"
                                }`}
                        >
                            {dontShowAgain && (
                                <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white fill-current">
                                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                        <span
                            className="text-xs text-white/55 cursor-pointer select-none hover:text-white/75 transition-colors"
                            onClick={() => setDontShowAgain(!dontShowAgain)}
                        >
                            下次不再顯示
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
