import React from 'react';
import { RiskClass } from '../../types';
import { getRiskColor, getRiskBadgeClasses } from '../../utils/formatters';

interface RiskGaugeProps {
  score: number;
  riskClass: RiskClass | string;
  probability?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskClass,
  probability,
  size = 'md',
  showDetails = true,
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const color = getRiskColor(riskClass);
  const badgeClasses = getRiskBadgeClasses(riskClass);

  // SVG parameters for 180-degree semi-circle
  const radius = size === 'sm' ? 45 : size === 'lg' ? 80 : 65;
  const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 14 : 11;
  const width = radius * 2 + strokeWidth * 2;
  const height = radius + strokeWidth * 2 + 10;
  
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Background Arc */}
          <path
            d={`M ${strokeWidth},${radius + strokeWidth} A ${radius},${radius} 0 0,1 ${
              radius * 2 + strokeWidth
            },${radius + strokeWidth}`}
            fill="none"
            stroke="#E1E6E4"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Meter Progress Arc */}
          <path
            d={`M ${strokeWidth},${radius + strokeWidth} A ${radius},${radius} 0 0,1 ${
              radius * 2 + strokeWidth
            },${radius + strokeWidth}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="font-mono font-extrabold text-stone-900 leading-none" style={{
            fontSize: size === 'sm' ? '1.25rem' : size === 'lg' ? '2.25rem' : '1.75rem'
          }}>
            {normalizedScore.toFixed(1)}
          </span>
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            / 100 Index
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 flex flex-col items-center gap-1">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClasses.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badgeClasses.dot}`} />
            {riskClass.toUpperCase()} HAZARD
          </span>

          {probability !== undefined && (
            <span className="text-[11px] text-stone-500 font-medium">
              Landslide Occurrence Probability: {(probability * 100).toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};
