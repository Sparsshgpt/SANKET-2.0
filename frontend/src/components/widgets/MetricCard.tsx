import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    isGood?: boolean;
  };
  variant?: 'mountain' | 'soil' | 'stone' | 'critical' | 'warning';
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  sublabel,
  icon,
  trend,
  variant = 'mountain',
  className = '',
  onClick,
}) => {
  const variantStyles = {
    mountain: {
      iconBg: 'bg-mountain-50 text-mountain-800 border-mountain-200',
      borderAccent: 'border-l-4 border-l-mountain-600',
    },
    soil: {
      iconBg: 'bg-soil-50 text-soil-800 border-soil-200',
      borderAccent: 'border-l-4 border-l-soil-500',
    },
    stone: {
      iconBg: 'bg-stone-100 text-stone-700 border-stone-200',
      borderAccent: 'border-l-4 border-l-stone-400',
    },
    critical: {
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      borderAccent: 'border-l-4 border-l-rose-600',
    },
    warning: {
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderAccent: 'border-l-4 border-l-amber-600',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-stone-200/90 p-4 shadow-soft-earth transition-all duration-200 ${
        style.borderAccent
      } ${
        onClick
          ? 'cursor-pointer hover:shadow-elevated-earth hover:border-stone-300'
          : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">
            {label}
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-mono">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-medium text-stone-500">{unit}</span>
            )}
          </div>
        </div>

        <div
          className={`p-2.5 rounded-xl border shrink-0 flex items-center justify-center ${style.iconBg}`}
        >
          {icon}
        </div>
      </div>

      {(sublabel || trend) && (
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
          {sublabel && <span className="text-stone-500 truncate">{sublabel}</span>}
          {trend && (
            <div
              className={`flex items-center gap-1 font-medium ml-auto ${
                trend.direction === 'up'
                  ? trend.isGood
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                  : trend.direction === 'down'
                  ? trend.isGood
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                  : 'text-stone-500'
              }`}
            >
              {trend.direction === 'up' && <TrendingUp size={13} />}
              {trend.direction === 'down' && <TrendingDown size={13} />}
              {trend.direction === 'neutral' && <Minus size={13} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
