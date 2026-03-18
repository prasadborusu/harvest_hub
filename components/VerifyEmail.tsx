
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

interface VerifyEmailProps {
  email: string;
  password: string;
  onSwitchToLogin: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, password, onSwitchToLogin }) => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleVerificationSimulation = async () => {
    setError(null);
    setIsLoading(true);
    try {
      // 1. Mark the user as verified in the mock database
      await api.verifyUser(email);
      // 2. Log the user in, which creates a session and updates app state
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during verification.');
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800">{t('verifyEmail.title')}</h2>
      <p className="mt-4 text-gray-600" dangerouslySetInnerHTML={{ __html: t('verifyEmail.instruction', { email: `<strong>${email}</strong>` }) }} />

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="mt-8">
        <p className="text-xs text-gray-500 mb-2">{t('verifyEmail.simulationNote')}</p>
        <button
          onClick={handleVerificationSimulation}
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all active:scale-95 disabled:bg-orange-300"
        >
          {isLoading ? t('verifyEmail.verifying') : t('verifyEmail.button')}
        </button>
      </div>

      <div className="mt-6">
        <button onClick={onSwitchToLogin} className="font-medium text-sm text-green-600 hover:text-green-500">
          {t('verifyEmail.backToSignIn')}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
