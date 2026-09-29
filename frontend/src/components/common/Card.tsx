import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  topoPattern?: boolean;
  hoverEffect?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  headerAction,
  topoPattern = false,
  hoverEffect = false,
  className = '',
  headerClassName = '',
  bodyClassName = 'p-5',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-stone-200/90 shadow-soft-earth overflow-hidden transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-elevated-earth hover:border-mountain-300' : ''
      } ${className}`}
    >
      {(title || headerAction) && (
        <div
          className={`px-5 py-3.5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 ${
            topoPattern ? 'topographic-lines bg-stone-50/70' : 'bg-stone-50/50'
          } ${headerClassName}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <span className="p-1.5 rounded-lg bg-mountain-100/70 text-mountain-800 shrink-0">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-stone-900 tracking-tight leading-snug">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-stone-500 font-normal leading-relaxed mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {headerAction && <div className="shrink-0 flex items-center self-start sm:self-center">{headerAction}</div>}
        </div>
      )}

      <div className={bodyClassName}>{children}</div>
    </div>
  );
};
