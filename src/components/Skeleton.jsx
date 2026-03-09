import React from 'react';

/**
 * Skeleton Loading Component
 * - Smooth animated placeholders
 * - Maintains layout structure
 * - Reduces perceived loading time
 */

const Skeleton = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  circle = false,
}) => {
  return (
    <div
      className={`skeleton bg-gradient-to-r from-surface-light to-surface-dark animate-pulse rounded-lg
        ${width} ${height} ${className}
        ${circle ? 'rounded-full' : ''}
      `}
    />
  );
};

/**
 * SkeletonCard Component
 * - Common card skeleton layout
 */
const SkeletonCard = ({ lines = 3 }) => {
  return (
    <div className="card space-y-4">
      {/* Header */}
      <Skeleton width="w-3/4" height="h-6" />

      {/* Lines */}
      <div className="space-y-3">
        {[...Array(lines)].map((_, i) => (
          <Skeleton
            key={i}
            width={i === lines - 1 ? 'w-2/3' : 'w-full'}
            height="h-4"
          />
        ))}
      </div>

      {/* Avatar + Text */}
      <div className="flex items-center gap-3 pt-2">
        <Skeleton width="w-10" height="h-10" circle />
        <Skeleton width="w-1/3" height="h-4" />
      </div>
    </div>
  );
};

/**
 * SkeletonGrid Component
 * - Multiple skeleton cards
 */
const SkeletonGrid = ({ count = 6, cols = 3 }) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${colClasses[cols]}`}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export { Skeleton, SkeletonCard, SkeletonGrid };
export default Skeleton;
