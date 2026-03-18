
import React from 'react';
import { AppView, UserRole } from '../types';
import DashboardIcon from './icons/DashboardIcon';
import LeafIcon from './icons/LeafIcon';
import SparklesIcon from './icons/SparklesIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import ListingsIcon from './icons/ListingsIcon';
import StoreIcon from './icons/StoreIcon';
import { useLanguage } from '../hooks/useLanguage';

interface BottomNavBarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  userRole: UserRole;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center w-full pt-1 pb-2 gap-0.5 relative transition-all duration-200 active:scale-90"
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
  >
    {/* Active pill indicator */}
    <span
      className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${isActive ? 'w-6 bg-green-500' : 'w-0 bg-transparent'
        }`}
    />
    {/* Icon */}
    <span className={`transition-colors duration-200 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
      {icon}
    </span>
    {/* Label */}
    <span
      className={`text-[10px] font-semibold transition-colors duration-200 leading-tight ${isActive ? 'text-green-600' : 'text-gray-400'
        }`}
    >
      {label}
    </span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setCurrentView, userRole }) => {
  const { t } = useLanguage();

  const farmerNav = [
    { id: AppView.DASHBOARD, label: t('bottomNav.dashboard'), icon: <DashboardIcon className="w-5 h-5" /> },
    { id: AppView.CROP_ANALYSIS, label: t('bottomNav.analyze'), icon: <LeafIcon className="w-5 h-5" /> },
    { id: AppView.VOICE_ASSISTANT, label: t('bottomNav.assistant'), icon: <SparklesIcon className="w-5 h-5" /> },
    { id: AppView.SELL_PRODUCE, label: 'Sell', icon: <StoreIcon className="w-5 h-5" /> },
    { id: AppView.FERTILIZER_STORE, label: t('bottomNav.buy'), icon: <ShoppingCartIcon className="w-5 h-5" /> },
  ];

  const buyerNav = [
    { id: AppView.FERTILIZER_STORE, label: t('bottomNav.buy'), icon: <ShoppingCartIcon className="w-5 h-5" /> },
  ];

  const sellerNav = [
    { id: AppView.MANAGE_LISTINGS, label: t('bottomNav.listings'), icon: <ListingsIcon className="w-5 h-5" /> },
  ];

  let navItems = farmerNav;
  if (userRole === UserRole.BUYER) navItems = buyerNav;
  if (userRole === UserRole.SELLER) navItems = sellerNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 z-10 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div
        className="flex justify-around items-stretch max-w-lg mx-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', minHeight: '3.75rem' }}
      >
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={currentView === item.id}
            onClick={() => setCurrentView(item.id)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
