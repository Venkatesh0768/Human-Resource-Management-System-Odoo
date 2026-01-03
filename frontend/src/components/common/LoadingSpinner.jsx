import React from 'react';

const LoadingSpinner = ({
  // Size variants
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
  
  // Color variants
  color = 'primary', // 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'white'
  
  // Type variants
  type = 'spinner', // 'spinner', 'dots', 'pulse', 'ring', 'bars', 'grid', 'clock', 'hourglass', 'orbit', 'infinity'
  
  // Text options
  text = '',
  textPosition = 'bottom', // 'top', 'bottom', 'left', 'right'
  textSize = 'sm', // 'xs', 'sm', 'md', 'lg'
  
  // Layout
  fullScreen = false,
  fullWidth = false,
  centered = true,
  
  // Customization
  className = '',
  style = {},
  
  // Animation
  speed = 'normal', // 'slow', 'normal', 'fast'
  
  // Accessibility
  label = 'Loading...',
  
  // Overlay
  withOverlay = false,
  overlayColor = 'bg-white/75',
  blurBackground = false,
  
  // Additional
  customIcon = null,
  showPercentage = false,
  percentage = 0,
  showCountdown = false,
  countdownFrom = 3
}) => {
  // Size mapping
  const sizeMap = {
    xs: { spinner: 'w-4 h-4', text: 'text-xs', container: 'p-1' },
    sm: { spinner: 'w-6 h-6', text: 'text-sm', container: 'p-2' },
    md: { spinner: 'w-8 h-8', text: 'text-base', container: 'p-3' },
    lg: { spinner: 'w-12 h-12', text: 'text-lg', container: 'p-4' },
    xl: { spinner: 'w-16 h-16', text: 'text-xl', container: 'p-5' }
  };

  // Color mapping
  const colorMap = {
    primary: 'text-indigo-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    light: 'text-gray-300',
    dark: 'text-gray-800',
    white: 'text-white'
  };

  // Speed mapping
  const speedMap = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  };

  // Get size and color classes
  const sizeClass = sizeMap[size]?.spinner || sizeMap.md.spinner;
  const textSizeClass = sizeMap[size]?.text || sizeMap.md.text;
  const colorClass = colorMap[color] || colorMap.primary;
  const speedClass = speedMap[speed] || speedMap.normal;

  // Render different spinner types
  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`flex items-center justify-center space-x-1 ${sizeClass}`}>
            <div className={`w-1/3 h-1/3 ${colorClass} rounded-full animate-bounce`}></div>
            <div className={`w-1/3 h-1/3 ${colorClass} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`w-1/3 h-1/3 ${colorClass} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          </div>
        );

      case 'pulse':
        return (
          <div className={`relative ${sizeClass}`}>
            <div className={`absolute inset-0 ${colorClass} rounded-full animate-ping opacity-75`}></div>
            <div className={`relative ${sizeClass} ${colorClass} rounded-full`}></div>
          </div>
        );

      case 'ring':
        return (
          <div className={`${sizeClass} relative`}>
            <div className={`absolute inset-0 border-2 ${colorClass.replace('text', 'border')} border-opacity-25 rounded-full`}></div>
            <div className={`absolute inset-0 border-2 ${colorClass.replace('text', 'border')} border-t-transparent rounded-full ${speedClass}`}></div>
          </div>
        );

      case 'bars':
        return (
          <div className={`flex items-center justify-center space-x-1 ${sizeClass}`}>
            <div className={`w-1/4 h-full ${colorClass} rounded animate-bar1`}></div>
            <div className={`w-1/4 h-full ${colorClass} rounded animate-bar2`}></div>
            <div className={`w-1/4 h-full ${colorClass} rounded animate-bar3`}></div>
            <div className={`w-1/4 h-full ${colorClass} rounded animate-bar4`}></div>
          </div>
        );

      case 'grid':
        return (
          <div className={`grid grid-cols-3 gap-1 ${sizeClass}`}>
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`${colorClass} rounded animate-grid-pulse`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        );

      case 'clock':
        return (
          <div className={`relative ${sizeClass}`}>
            <div className={`absolute inset-0 ${colorClass.replace('text', 'border')} border-2 rounded-full`}></div>
            <div className={`absolute top-1/2 left-1/2 w-1/2 h-0.5 ${colorClass} origin-left animate-clock-hour`}></div>
            <div className={`absolute top-1/2 left-1/2 w-2/3 h-0.5 ${colorClass} origin-left animate-clock-minute`}></div>
          </div>
        );

      case 'hourglass':
        return (
          <div className={`relative ${sizeClass}`}>
            <div className={`absolute inset-0 ${colorClass} animate-hourglass`}>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-current rounded-t-full"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-current rounded-b-full transform scale-y(-1)"></div>
            </div>
          </div>
        );

      case 'orbit':
        return (
          <div className={`relative ${sizeClass}`}>
            <div className={`absolute inset-0 ${colorClass.replace('text', 'border')} border-2 rounded-full opacity-25`}></div>
            <div className={`absolute top-0 left-1/2 w-1/4 h-1/4 ${colorClass} rounded-full -translate-x-1/2 animate-orbit`}></div>
            <div className={`absolute bottom-0 left-1/2 w-1/4 h-1/4 ${colorClass} rounded-full -translate-x-1/2 animate-orbit-reverse`}></div>
          </div>
        );

      case 'infinity':
        return (
          <div className={`relative ${sizeClass}`}>
            <svg className={`w-full h-full ${colorClass}`} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                fillOpacity="0.3"
              />
              <path
                d="M12 6v6l4 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        );

      case 'custom':
        return customIcon ? customIcon : renderDefaultSpinner();

      default: // 'spinner'
        return renderDefaultSpinner();
    }
  };

  // Default spinner (most common)
  const renderDefaultSpinner = () => (
    <div className={`${sizeClass} ${colorClass} ${speedClass}`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  // Render text with spinner
  const renderWithText = () => {
    const textElement = text && (
      <span className={`${textSizeClass} ${colorClass} font-medium transition-opacity duration-300`}>
        {text}
        {showPercentage && (
          <span className="ml-2 font-bold">{percentage}%</span>
        )}
      </span>
    );

    const spinner = renderSpinner();

    const layoutClasses = {
      top: 'flex-col-reverse',
      bottom: 'flex-col',
      left: 'flex-row-reverse',
      right: 'flex-row'
    };

    const spacingClasses = {
      top: 'space-y-reverse space-y-2',
      bottom: 'space-y-2',
      left: 'space-x-reverse space-x-3',
      right: 'space-x-3'
    };

    return (
      <div className={`flex items-center justify-center ${layoutClasses[textPosition]} ${spacingClasses[textPosition]}`}>
        {spinner}
        {textElement}
      </div>
    );
  };

  // Countdown timer (for loading with timeout)
  const [countdown, setCountdown] = React.useState(countdownFrom);
  
  React.useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showCountdown, countdown]);

  // Main container classes
  const containerClasses = `
    ${fullScreen ? 'fixed inset-0 z-50' : 'relative'}
    ${centered ? 'flex items-center justify-center' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Overlay classes
  const overlayClasses = `
    ${withOverlay ? 'absolute inset-0' : ''}
    ${overlayColor}
    ${blurBackground ? 'backdrop-blur-sm' : ''}
  `;

  // Render the loading component
  return (
    <div
      className={containerClasses}
      style={style}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      {/* Overlay */}
      {withOverlay && <div className={overlayClasses} />}

      {/* Main content */}
      <div className={`relative z-10 ${centered ? 'text-center' : ''}`}>
        {text ? renderWithText() : renderSpinner()}
        
        {/* Countdown display */}
        {showCountdown && countdown > 0 && (
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              Starting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </div>
            <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden mt-2 mx-auto">
              <div
                className="h-full bg-indigo-600 transition-all duration-1000"
                style={{ width: `${((countdownFrom - countdown) / countdownFrom) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Progress bar for percentage */}
        {showPercentage && percentage < 100 && (
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Loading</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Accessibility: Screen reader only text */}
      <span className="sr-only">{label}</span>
    </div>
  );
};

// Export with named exports for different spinner types
export const Spinner = (props) => <LoadingSpinner type="spinner" {...props} />;
export const Dots = (props) => <LoadingSpinner type="dots" {...props} />;
export const Pulse = (props) => <LoadingSpinner type="pulse" {...props} />;
export const Ring = (props) => <LoadingSpinner type="ring" {...props} />;
export const Bars = (props) => <LoadingSpinner type="bars" {...props} />;
export const Grid = (props) => <LoadingSpinner type="grid" {...props} />;
export const Clock = (props) => <LoadingSpinner type="clock" {...props} />;
export const Hourglass = (props) => <LoadingSpinner type="hourglass" {...props} />;
export const Orbit = (props) => <LoadingSpinner type="orbit" {...props} />;
export const InfinitySpinner = (props) => <LoadingSpinner type="infinity" {...props} />;

// Pre-configured variants
export const PageLoader = (props) => (
  <LoadingSpinner
    fullScreen
    withOverlay
    overlayColor="bg-white/90"
    blurBackground
    size="lg"
    type="ring"
    text="Loading page..."
    textPosition="bottom"
    centered
    {...props}
  />
);

export const ButtonLoader = (props) => (
  <LoadingSpinner
    size="sm"
    color="white"
    type="spinner"
    speed="fast"
    className="inline-block"
    {...props}
  />
);

export const TableLoader = (props) => (
  <LoadingSpinner
    size="md"
    type="dots"
    text="Loading data..."
    textPosition="bottom"
    centered
    fullWidth
    {...props}
  />
);

export const CardLoader = (props) => (
  <LoadingSpinner
    size="lg"
    type="pulse"
    color="primary"
    centered
    {...props}
  />
);

export const InlineLoader = (props) => (
  <LoadingSpinner
    size="xs"
    type="spinner"
    color="current"
    centered={false}
    className="inline-block align-middle"
    {...props}
  />
);

export default LoadingSpinner;