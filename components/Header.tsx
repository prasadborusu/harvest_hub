
import React from 'react';
import { AppView, UserRole, LanguageCode } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
  currentView: AppView;
  userRole: UserRole;
}

const ROLE_CONFIG: Record<UserRole, { label: string; emoji: string; color: string }> = {
  [UserRole.FARMER]: { label: 'Farmer', emoji: '🧑‍🌾', color: 'bg-green-100 text-green-800' },
  [UserRole.BUYER]: { label: 'Buyer', emoji: '🛒', color: 'bg-blue-100 text-blue-800' },
  [UserRole.SELLER]: { label: 'Seller', emoji: '🏪', color: 'bg-amber-100 text-amber-800' },
};

const VIEW_TITLES: Partial<Record<AppView, string>> = {
  [AppView.DASHBOARD]: 'Dashboard',
  [AppView.CROP_ANALYSIS]: 'Crop Analysis',
  [AppView.VOICE_ASSISTANT]: 'AI Assistant',
  [AppView.FERTILIZER_STORE]: 'Fertilizer Store',
  [AppView.MANAGE_LISTINGS]: 'Manage Listings',
};

const Header: React.FC<HeaderProps> = ({ currentView, userRole }) => {
  const { logout, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const roleConfig = ROLE_CONFIG[userRole];

  return (
    <header className="glass sticky top-0 z-20 flex-shrink-0 pt-[env(safe-area-inset-top)] border-b border-white/60 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        {/* Left — logo + title */}
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🌱</span>
          <h1 className="text-base font-bold text-gray-800 tracking-tight">
            {VIEW_TITLES[currentView] ?? 'HarvestHub'}
          </h1>
        </div>

        {/* Right — lang + role chip + logout */}
        <div className="flex items-center gap-2">
          {/* Language selector — icon only on mobile */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="hidden sm:block text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-600"
            aria-label={t('auth.selectLanguage')}
          >
            <option value={LanguageCode.ENGLISH}>EN</option>
            <option value={LanguageCode.HINDI}>HI</option>
            <option value={LanguageCode.TELUGU}>TE</option>
            <option value={LanguageCode.MALAYALAM}>ML</option>
          </select>

          {/* Role chip */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${roleConfig.color}`}>
            <span>{roleConfig.emoji}</span>
            <span className="hidden sm:inline">{user?.displayName ?? roleConfig.label}</span>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all"
          >
            <span className="hidden sm:inline">Logout</span>
            <span>⏻</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;