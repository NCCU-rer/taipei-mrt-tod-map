import MrtMap from "./components/MrtMap";
import Footer from "./components/Footer";

export default function Page() {
  return (
    // 1. 移除 h-screen 與 overflow-hidden，改用 min-h-screen 允許捲動
    <main className="flex flex-col w-full min-h-screen bg-[#f9fafb]">
      {/* 2. 地圖區域：強制設定高度為 100dvh (100% 視窗高度) 
          這樣地圖會剛好佔滿一開始的畫面 */}
      <div className="w-full h-[100dvh] relative">
        <MrtMap />
      </div>

      {/* 3. Footer 區域：會自然排在地圖下方
          使用者需要「往下滑」超過 100vh 的地圖才會看到它 */}
      <Footer />
    </main>
  );
}
