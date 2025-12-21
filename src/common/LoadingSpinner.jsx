import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false, text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-3',
    xl: 'h-20 w-20 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${sizeClasses[size]} animate-spin rounded-full border-blue-600 border-t-transparent`}
      />
      {text && <p className="mt-4 text-gray-600 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;