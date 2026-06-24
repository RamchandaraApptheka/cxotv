'use client';

const LoadingSpinner = ({ size = 'medium', className = '', fullPage = false }) => {
  const sizeClasses = {
    small: 'scale-50',
    medium: 'scale-75', 
    large: 'scale-100'
  };

  const spinnerElement = <div className={`spinner ${sizeClasses[size]}`}></div>;

  if (fullPage) {
    return (
      <div className={`grid min-h-[calc(100vh-3.5rem)] place-items-center ${className}`}>
        {spinnerElement}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      {spinnerElement}
    </div>
  );
};

export default LoadingSpinner;
