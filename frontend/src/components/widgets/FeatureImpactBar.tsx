import React from 'react';
import { FactorSensitivity } from '../../types';

interface FeatureImpactBarProps {
  factors: FactorSensitivity[];
  limit?: number;
}

export const FeatureImpactBar: React.FC<FeatureImpactBarProps> = ({
  factors,
  limit = 5,
}) => {
  const displayed = factors.slice(0, limit);

  const getStatusColor = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return 'bg-rose-600 text-rose-700';
      case 'warning':
        return 'bg-amber-500 text-amber-700';
      case 'safe':
      default:
        return 'bg-emerald-600 text-emerald-700';
    }
  };

  return (
    <div className="space-y-3">
      {displayed.map((factor) => {
        return (
          <div key={factor.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-700">{factor.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-stone-900">
                  {factor.displayValue}
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  ({factor.impactPercent}% impact)
                </span>
              </div>
            </div>

            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/60">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  factor.status === 'critical'
                    ? 'bg-rose-600'
                    : factor.status === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.max(4, factor.impactPercent)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
