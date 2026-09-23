import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'soil';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 font-semibold',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-mountain-800 hover:bg-mountain-700 active:bg-mountain-900 text-white shadow-sm focus:ring-mountain-700',
    secondary:
      'bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 border border-stone-200 focus:ring-stone-400',
    outline:
      'bg-transparent hover:bg-mountain-50 text-mountain-800 border border-mountain-300 active:bg-mountain-100 focus:ring-mountain-600',
    soil:
      'bg-soil-700 hover:bg-soil-600 active:bg-soil-800 text-white shadow-sm focus:ring-soil-600',
    danger:
      'bg-risk-critical hover:bg-rose-700 active:bg-rose-900 text-white shadow-sm focus:ring-rose-500',
    ghost:
      'bg-transparent hover:bg-stone-100 active:bg-stone-200 text-stone-700 focus:ring-stone-300',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-0.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0">{icon}</span>
      ) : null}

      <span>{children}</span>

      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};
