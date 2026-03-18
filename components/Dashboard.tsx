import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentWeather, getUserLocation, WeatherData } from '../services/weatherService';
import { AppView } from '../types';

// ─── Weather Card ────────────────────────────────────────────────────────────
const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const coords = await getUserLocation();
        const data = await getCurrentWeather(coords.latitude, coords.longitude);
        if (!cancelled) setWeather(data);
      } catch {
        if (!cancelled) setError('Enable location to see live weather.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="skeleton w-10 h-10 rounded-full bg-white/20" />
          <div className="skeleton w-32 h-5 rounded bg-white/20" />
        </div>
        <div className="skeleton w-20 h-10 rounded bg-white/20 mb-2" />
        <div className="skeleton w-48 h-4 rounded bg-white/20" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg flex items-center gap-4">
        <span className="text-4xl">🌐</span>
        <div>
          <p className="font-semibold">Live Weather Unavailable</p>
          <p className="text-sm text-blue-100 mt-0.5">{error ?? 'Could not fetch data.'}</p>
        </div>
      </div>
    );
  }

  // Background gradient by condition
  const isRainy = weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('drizzle');
  const isCloudy = weather.condition.toLowerCase().includes('cloud') || weather.condition.toLowerCase().includes('overcast');
  const isStormy = weather.condition.toLowerCase().includes('thunder') || weather.condition.toLowerCase().includes('storm');
  const gradientClass = isStormy
    ? 'from-slate-600 to-slate-800'
    : isRainy
      ? 'from-blue-600 to-slate-700'
      : isCloudy
        ? 'from-blue-400 to-slate-500'
        : 'from-sky-400 to-blue-600';

  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${gradientClass} text-white shadow-lg`}>
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/70 uppercase tracking-wider">
            {weather.cityName ?? 'Your Location'}
          </p>
          <p className="text-6xl font-black mt-1 leading-none">{weather.temp}°</p>
          <p className="text-lg font-semibold mt-1">{weather.condition}</p>
          <p className="text-sm text-white/70">Feels like {weather.feelsLike}°C</p>
        </div>
        <span className="text-6xl drop-shadow-md select-none">{weather.icon}</span>
      </div>
      {/* Stats row */}
      <div className="mt-4 flex gap-4 border-t border-white/20 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">💧</span>
          <div>
            <p className="text-xs text-white/60">Humidity</p>
            <p className="text-sm font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">💨</span>
          <div>
            <p className="text-xs text-white/60">Wind</p>
            <p className="text-sm font-semibold">{weather.windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-white/50 italic">via Open-Meteo</span>
        </div>
      </div>
    </div>
  );
};

// ─── Quick-action card ───────────────────────────────────────────────────────
const QuickCard: React.FC<{ emoji: string; label: string; sub: string; color: string; onClick?: () => void }> = ({
  emoji, label, sub, color, onClick,
}) => (
  <button
    onClick={onClick}
    className={`card text-left p-4 w-full flex items-center gap-3 active:scale-95 transition-transform ${color}`}
  >
    <span className="text-3xl">{emoji}</span>
    <div>
      <p className="font-semibold text-gray-800 text-sm leading-tight">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
    <span className="ml-auto text-gray-300">›</span>
  </button>
);

// ─── Dashboard ───────────────────────────────────────────────────────────────
interface DashboardProps {
  setCurrentView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
  const { language } = useLanguage();
  const { user } = useAuth();

  // ── Inline translations ──────────────────────────────────────────────────
  const i18n: Record<string, Record<string, string>> = {
    'en-US': {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      quickActions: 'Quick Actions',
      cropLabel: 'Crop Analysis',
      cropSub: 'Detect diseases with AI',
      aiLabel: 'AI Assistant',
      aiSub: 'Ask farming questions by voice',
      storeLabel: 'Fertilizer Store',
      storeSub: 'Browse and buy inputs',
      tipTitle: 'Farming Tip of the Day',
      tip: 'Monitor your crops early in the morning — pests and diseases are easiest to spot in good light before the heat sets in.',
    },
    'hi-IN': {
      morning: 'शुभ प्रभात',
      afternoon: 'शुभ दोपहर',
      evening: 'शुभ संध्या',
      quickActions: 'त्वरित क्रियाएं',
      cropLabel: 'फसल विश्लेषण',
      cropSub: 'AI से रोग पता लगाएं',
      aiLabel: 'AI सहायक',
      aiSub: 'आवाज़ से खेती के सवाल पूछें',
      storeLabel: 'उर्वरक स्टोर',
      storeSub: 'इनपुट ब्राउज़ करें और खरीदें',
      tipTitle: 'आज की खेती टिप',
      tip: 'सुबह जल्दी अपनी फसलों की निगरानी करें — कीट और रोग अच्छी रोशनी में गर्मी से पहले सबसे आसानी से दिखते हैं।',
    },
    'te-IN': {
      morning: 'శుభోదయం',
      afternoon: 'శుభ మధ్యాహ్నం',
      evening: 'శుభ సాయంత్రం',
      quickActions: 'శీఘ్ర చర్యలు',
      cropLabel: 'పంట విశ్లేషణ',
      cropSub: 'AI తో వ్యాధులు గుర్తించండి',
      aiLabel: 'AI సహాయకుడు',
      aiSub: 'వాయిస్ ద్వారా వ్యవసాయ ప్రశ్నలు అడగండి',
      storeLabel: 'ఎరువుల స్టోర్',
      storeSub: 'ఇన్‌పుట్‌లు బ్రౌజ్ చేసి కొనండి',
      tipTitle: 'నేటి వ్యవసాయ చిట్కా',
      tip: 'ఉదయాన్నే మీ పంటలను పరిశీలించండి — వేడి రాకముందే మంచి వెలుతురులో తెగుళ్ళు మరియు వ్యాధులు సులభంగా కనిపిస్తాయి.',
    },
    'ml-IN': {
      morning: 'ശുഭ പ്രഭാതം',
      afternoon: 'ശുഭ ഉച്ചരാശി',
      evening: 'ശുഭ സന്ധ്യ',
      quickActions: 'ദ്രുത പ്രവർത്തനങ്ങൾ',
      cropLabel: 'വിള വിശകലനം',
      cropSub: 'AI ഉപയോഗിച്ച് രോഗങ്ങൾ കണ്ടെത്തുക',
      aiLabel: 'AI അസിസ്റ്റന്റ്',
      aiSub: 'ശബ്ദം ഉപയോഗിച്ച് കൃഷി ചോദ്യങ്ങൾ ചോദിക്കുക',
      storeLabel: 'വളം കട',
      storeSub: 'ഇൻപുട്ടുകൾ ബ്രൗസ് ചെയ്ത് വാങ്ങുക',
      tipTitle: 'ഇന്നത്തെ കൃഷി നുറുങ്ങ്',
      tip: 'രാവിലെ നേരത്തേ വിളകൾ നിരീക്ഷിക്കുക — ചൂട് വരുന്നതിന് മുമ്പ് നല്ല വെളിച്ചത്തിൽ കീടങ്ങളും രോഗങ്ങളും എളുപ്പം കണ്ടെത്താം.',
    },
  };

  const tr = i18n[language] ?? i18n['en-US'];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return tr.morning;
    if (h < 17) return tr.afternoon;
    return tr.evening;
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-2xl mx-auto">
      {/* Greeting */}
      <div>
        <p className="text-gray-500 text-sm font-medium">{greeting()},</p>
        <h1 className="text-2xl font-bold text-gray-800">{user?.displayName ?? 'Farmer'} 👋</h1>
      </div>

      {/* Live weather */}
      <WeatherCard />

      {/* Quick actions — farmer only */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{tr.quickActions}</p>
        <div className="grid grid-cols-1 gap-3">
          <QuickCard
            emoji="🔬"
            label={tr.cropLabel}
            sub={tr.cropSub}
            color="border-l-4 border-green-500"
            onClick={() => setCurrentView(AppView.CROP_ANALYSIS)}
          />
          <QuickCard
            emoji="🤖"
            label={tr.aiLabel}
            sub={tr.aiSub}
            color="border-l-4 border-blue-500"
            onClick={() => setCurrentView(AppView.VOICE_ASSISTANT)}
          />
          <QuickCard
            emoji="🛒"
            label={tr.storeLabel}
            sub={tr.storeSub}
            color="border-l-4 border-amber-500"
            onClick={() => setCurrentView(AppView.FERTILIZER_STORE)}
          />
        </div>
      </div>

      {/* Farming tip */}
      <div className="rounded-2xl bg-green-50 border border-green-100 p-4 flex gap-3 items-start">
        <span className="text-2xl">💡</span>
        <div>
          <p className="text-sm font-semibold text-green-800">{tr.tipTitle}</p>
          <p className="text-sm text-green-700 mt-1">{tr.tip}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
