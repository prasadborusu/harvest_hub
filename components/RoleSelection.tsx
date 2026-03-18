
import React, { useState } from 'react';
import { UserRole, LanguageCode } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void | Promise<void>;
}

const RoleCard: React.FC<{ 
  title: string; 
  description: string; 
  emoji: string; 
  onClick: () => void;
  isSelected?: boolean;
}> = ({ title, description, emoji, onClick, isSelected = false }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('RoleCard clicked:', title);
    onClick();
  };

  return (
    <button
        onClick={handleClick}
        type="button"
        className={`w-full md:w-80 text-left p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-100 cursor-pointer ${
          isSelected 
            ? 'bg-green-50 border-2 border-green-500' 
            : 'bg-white border-2 border-transparent'
        }`}
    >
        <div className="flex flex-col items-center space-y-3">
            <div className="text-5xl">{emoji}</div>
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{description}</p>
            </div>
        </div>
    </button>
  );
};


const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleClick = async (role: UserRole) => {
    console.log('Role clicked:', role);
    setSelectedRole(role);
    setIsLoading(true);
    try {
      console.log('Calling onSelectRole...');
      await onSelectRole(role);
      console.log('Role selection successful');
      // Role selection successful - the App component will re-render and navigate away
      // Don't set isLoading to false here as component will unmount
    } catch (error: any) {
      console.error('Error selecting role:', error);
      alert(error?.message || 'Failed to select role. Please try again.');
      setSelectedRole(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          className="rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-sm px-3 py-2 bg-white"
          aria-label={t('auth.selectLanguage')}
        >
          <option value={LanguageCode.ENGLISH}>{t('languages.en-US')}</option>
          <option value={LanguageCode.HINDI}>{t('languages.hi-IN')}</option>
          <option value={LanguageCode.TELUGU}>{t('languages.te-IN')}</option>
          <option value={LanguageCode.MALAYALAM}>{t('languages.ml-IN')}</option>
        </select>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-700">{t('roleSelection.welcome')}</h1>
        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
          {t('roleSelection.prompt')}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center items-center">
        <RoleCard 
            title={t('roleSelection.farmer')}
            description={t('roleSelection.farmerDesc')}
            emoji="🧑‍🌾"
            onClick={() => handleRoleClick(UserRole.FARMER)}
            isSelected={selectedRole === UserRole.FARMER}
        />
        <RoleCard 
            title={t('roleSelection.buyer')}
            description={t('roleSelection.buyerDesc')}
            emoji="🛒"
            onClick={() => handleRoleClick(UserRole.BUYER)}
            isSelected={selectedRole === UserRole.BUYER}
        />
        <RoleCard 
            title={t('roleSelection.seller')}
            description={t('roleSelection.sellerDesc')}
            emoji="📦"
            onClick={() => handleRoleClick(UserRole.SELLER)}
            isSelected={selectedRole === UserRole.SELLER}
        />
      </div>
      {isLoading && (
        <div className="mt-6 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
          <span className="ml-3 text-gray-600">{t('auth.verifying') || 'Loading...'}</span>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;
