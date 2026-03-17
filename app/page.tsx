"use client";

import { useState, useEffect } from "react";
import MrtMap from "./components/MrtMap";
import Footer from "./components/Footer";
import WelcomeOverlay from "./components/WelcomeOverlay";
import MethodModal from "./components/MethodModal";

const STORAGE_KEY = "tod-map-welcome-dismissed";

export default function Page() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showMethod, setShowMethod] = useState(false);

  // Only run on client — check localStorage to decide if overlay should show
  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setShowOverlay(true);
    }
  }, []);

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#f9fafb]">
      {/* Map — always full-screen */}
      <div className="w-full h-[100dvh] relative">
        <MrtMap onOpenMethod={() => setShowMethod(true)} />
      </div>

      <Footer />

      {/* Welcome overlay (rendered on top via fixed positioning) */}
      {showOverlay && (
        <WelcomeOverlay
          onClose={() => setShowOverlay(false)}
          onOpenMethod={() => {
            setShowOverlay(false);
            setShowMethod(true);
          }}
        />
      )}

      {/* Method modal */}
      {showMethod && (
        <MethodModal onClose={() => setShowMethod(false)} />
      )}
    </main>
  );
}

