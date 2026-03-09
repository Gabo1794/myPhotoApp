import React from 'react';

/**
 * ProgressBar Component
 * - Smooth animations
 * - Different variants
 * - Mobile optimized
 */

const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  animated = true,
  showLabel = false,
  label = '',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  const variantClasses = {
    primary: 'bg-accent',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div>
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-text-primary">{label}</label>
          <span className="text-sm font-semibold text-text-secondary">{Math.round(percentage)}%</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className={`w-full bg-surface-dark rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full
            transition-all duration-300 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
