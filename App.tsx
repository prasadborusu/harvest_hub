import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CropAnalysis from './components/CropAnalysis';
import VoiceAssistant from './components/VoiceAssistant';
import FertilizerStore from './components/FertilizerStore';
import ManageListings from './components/ManageListings';
import SellProduce from './components/SellProduce';
import BrowseProduce from './components/BrowseProduce';
import BottomNavBar from './components/BottomNavBar';
import Auth from './components/Auth';
import { AppView, UserRole, LanguageCode } from './types';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './hooks/useLanguage';


const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const { setLanguage } = useLanguage();
  const roleRef = useRef(user?.role);

  // Auto-detect language on first load
  useEffect(() => {
    const savedLang = localStorage.getItem('user-language');
    if (savedLang) {
      setLanguage(savedLang as LanguageCode);
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const countryCode = data?.address?.country_code;
            if (countryCode === 'in') {
              setLanguage(LanguageCode.HINDI);
            } else {
              setLanguage(LanguageCode.ENGLISH);
            }
          } catch {
            setLanguage(LanguageCode.ENGLISH);
          }
        },
        () => setLanguage(LanguageCode.ENGLISH)
      );
    }
  }, [setLanguage]);

  // Set default view based on role
  useEffect(() => {
    if (!user) return;
    if (user.role === UserRole.SELLER) setCurrentView(AppView.MANAGE_LISTINGS);
    else if (user.role === UserRole.BUYER) setCurrentView(AppView.BROWSE_PRODUCE);
    else setCurrentView(AppView.DASHBOARD);
  }, [user?.role]);

  const renderView = () => {
    // VoiceAssistant needs a bounded height container (no overflow-y-auto on parent)
    // so the internal flex spacer can push messages to the bottom correctly.
    if (currentView === AppView.VOICE_ASSISTANT) {
      return (
        <div key={currentView} className="view-container flex-1 flex flex-col min-h-0 pb-[calc(3.75rem+env(safe-area-inset-bottom))]">
          <VoiceAssistant />
        </div>
      );
    }
    // All other views use a scrollable wrapper
    return (
      <div key={currentView} className="view-container flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
        {(() => {
          switch (currentView) {
            case AppView.CROP_ANALYSIS:
              return <CropAnalysis setCurrentView={setCurrentView} />;
            case AppView.FERTILIZER_STORE:
              return <FertilizerStore />;
            case AppView.MANAGE_LISTINGS:
              return <ManageListings />;
            case AppView.SELL_PRODUCE:
              return <SellProduce />;
            case AppView.BROWSE_PRODUCE:
              return <BrowseProduce />;
            case AppView.DASHBOARD:
            default:
              return <Dashboard setCurrentView={setCurrentView} />;
          }
        })()}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center">
          <span className="text-4xl">🌱</span>
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500 mt-4"></div>
          <p className="mt-4 text-gray-600">Loading HarvestHub...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="h-full w-full bg-gray-100 font-sans flex flex-col relative overflow-hidden">
      {/* ── India Map Decorative Background ───────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 500 550"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full max-w-2xl"
          style={{ opacity: 0.045 }}
        >
          {/* Simplified India outline path */}
          <path
            d="M 245 30
               C 230 32, 210 38, 195 50
               C 175 62, 160 68, 145 80
               C 128 93, 118 105, 110 120
               C 100 138, 95 152, 90 168
               C 84 186, 80 200, 75 218
               C 70 236, 68 250, 70 265
               C 72 278, 78 290, 82 302
               C 88 318, 92 330, 96 345
               C 100 360, 102 375, 100 390
               C 98 403, 92 414, 88 425
               C 84 436, 80 445, 78 455
               C 76 464, 76 472, 80 480
               L 100 510
               C 108 520, 118 525, 128 522
               C 138 518, 145 510, 152 500
               C 160 490, 168 478, 176 468
               C 184 458, 192 448, 200 440
               C 208 432, 218 425, 228 420
               C 238 415, 248 412, 258 415
               C 268 418, 275 425, 282 432
               C 290 440, 296 450, 302 458
               C 308 466, 312 474, 318 480
               C 325 488, 333 494, 342 496
               C 352 498, 362 494, 370 485
               C 378 475, 380 462, 382 450
               C 384 438, 384 425, 380 412
               C 376 400, 368 390, 360 380
               C 352 370, 342 362, 335 350
               C 328 338, 324 325, 320 312
               C 316 298, 314 284, 315 270
               C 316 256, 320 243, 325 230
               C 330 218, 336 207, 340 195
               C 345 183, 348 170, 348 158
               C 348 145, 344 132, 338 120
               C 332 108, 323 98, 312 90
               C 300 82, 286 78, 272 72
               C 260 66, 250 58, 245 48
               Z"
            fill="url(#indiaGrad)"
            stroke="#16a34a"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="indiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
              <stop offset="50%" stopColor="#16a34a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#065f46" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Decorative dots for major cities */}
          {[
            [248, 120], // Delhi
            [210, 250], // Mumbai
            [310, 260], // Kolkata
            [268, 340], // Hyderabad
            [250, 400], // Bangalore
            [290, 430], // Chennai
            [160, 200], // Ahmedabad
            [330, 160], // Bhubaneswar
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={4} fill="#16a34a" opacity="0.6" />
          ))}
          {/* Grid lines (latitude-like) */}
          {[150, 200, 260, 320, 380, 430].map((y, i) => (
            <line key={i} x1="80" y1={y} x2="390" y2={y}
              stroke="#16a34a" strokeWidth="0.4" strokeDasharray="4 8" opacity="0.4" />
          ))}
          {[130, 180, 230, 280, 330, 370].map((x, i) => (
            <line key={i} x1={x} y1="30" x2={x} y2="520"
              stroke="#16a34a" strokeWidth="0.4" strokeDasharray="4 8" opacity="0.4" />
          ))}
        </svg>
      </div>
      {/* ── End Background ────────────────────────────────────────────── */}

      <Header
        currentView={currentView}
        userRole={user.role}
      />
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {renderView()}
      </main>
      <BottomNavBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={user.role}
      />
    </div>
  );
};

export default App;