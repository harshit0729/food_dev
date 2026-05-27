import React from 'react';

const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizes[size]} loading-spinner`} />
      {text && <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
);

export const CardSkeleton = () => (
  <div className="card p-4">
    <Skeleton className="h-40 w-full mb-4" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-2" />
    <Skeleton className="h-4 w-1/4" />
  </div>
);

export default Loader;
