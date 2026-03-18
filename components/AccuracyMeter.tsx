
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface AccuracyMeterProps {
  percentage: number;
}

const AccuracyMeter: React.FC<AccuracyMeterProps> = ({ percentage }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const { t } = useLanguage();

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
        aria-valuenow={percentage}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">
          {Math.round(percentage)}%
        </span>
      </div>
       <p className="text-sm font-medium text-gray-500 mt-2 absolute -bottom-6">{t('cropAnalysis.accuracy')}</p>
    </div>
  );
};

export default AccuracyMeter;
