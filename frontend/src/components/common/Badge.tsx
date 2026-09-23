import React from 'react';
import { RiskClass } from '../../types';
import { getRiskBadgeClasses } from '../../utils/formatters';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'risk' | 'soil' | 'mountain' | 'outline' | 'stone';
  riskClass?: RiskClass | string;
  size?: 'xs' | 'sm' | 'md';
  pulse?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  riskClass,
  size = 'sm',
  pulse = false,
  icon,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 tracking-wider font-semibold',
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-sm px-3 py-1 font-medium',
  };

  if (variant === 'risk' && riskClass) {
    const riskStyles = getRiskBadgeClasses(riskClass);
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border ${riskStyles.badge} ${sizeClasses[size]} ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${riskStyles.dot} ${
            pulse && riskClass.toUpperCase() === 'CRITICAL' ? 'beacon-critical' : ''
          }`}
        />
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
    );
  }

  const variantClasses = {
    default: 'bg-stone-100 text-stone-700 border-stone-200',
    soil: 'bg-soil-100 text-soil-900 border-soil-200',
    mountain: 'bg-mountain-100 text-mountain-900 border-mountain-200',
    outline: 'bg-transparent text-stone-700 border-stone-300',
    stone: 'bg-stone-200 text-stone-800 border-stone-300',
    risk: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 animate-ping shrink-0" />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
