import React from 'react';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaArrowRight,
  FaInfoCircle,
  FaEllipsisV,
  FaExternalLinkAlt
} from 'react-icons/fa';

const DashboardCard = ({
  // Required props
  title,
  value,
  
  // Optional props
  icon = null,
  color = 'blue', // 'blue', 'green', 'yellow', 'red', 'purple', 'indigo', 'gray'
  trend = null,
  trendUp = null, // true for up, false for down, null for neutral
  trendValue = null,
  description = null,
  footer = null,
  onClick = null,
  loading = false,
  error = false,
  errorMessage = 'Error loading data',
  
  // Style customization
  compact = false,
  bordered = true,
  shadow = true,
  hoverable = true,
  clickable = false,
  
  // Additional features
  showInfo = false,
  infoText = '',
  showMenu = false,
  menuItems = [],
  showLink = false,
  linkText = 'View details',
  onLinkClick = null,
  
  // Custom classes
  className = '',
  iconClassName = '',
  contentClassName = '',
  
  // Children (for custom content)
  children = null,
  
  // Progress bar
  progress = null, // Value between 0-100
  progressLabel = null,
  
  // Comparison
  comparisonValue = null,
  comparisonLabel = null,
  comparisonTrendUp = null
}) => {
  // Color configuration
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-800',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      progress: 'bg-blue-500',
      trendUp: 'text-green-600 bg-green-100',
      trendDown: 'text-red-600 bg-red-100'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-800',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      progress: 'bg-green-500',
      trendUp: 'text-green-600 bg-green-100',
      trendDown: 'text-red-600 bg-red-100'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
      text: 'text-yellow-800',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      progress: 'bg-yellow-500',
      trendUp: 'text-green-600 bg-green-100',
      trendDown: 'text-red-600 bg-red-100'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-800',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      progress: 'bg-red-500',
      trendUp: 'text-green-600 bg-green-100',
      trendDown: 'text-red-600 bg-red-100'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-800',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      progress: 'bg-purple-500',
      trendUp: 'text-green-600 bg-green-100',
      trendDown: 'text-red-600 bg-red-100'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      text: 'text-indigo-800',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      progress: 'bg-indigo-500',
      trendUp: 'text-green-600 bg-green-100',
      trendDown: 'text-red-600 bg-red-100'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-100',
      text: 'text-gray-800',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      progress: 'bg-gray-500',
      trendUp: 'text-green-600 bg-green-100',
      trendDown: 'text-red-600 bg-red-100'
    }
  };

  const config = colorConfig[color] || colorConfig.blue;

  // Handle click
  const handleClick = (e) => {
    if (clickable && onClick && !loading && !error) {
      onClick(e);
    }
  };

  // Render trend indicator
  const renderTrend = () => {
    if (!trend && trendUp === null) return null;

    let trendContent = trend;
    let trendClass = config.trendUp;
    
    if (trendUp !== null) {
      trendContent = trendUp ? (
        <>
          <FaArrowUp className="inline mr-1" />
          {trendValue || 'Up'}
        </>
      ) : (
        <>
          <FaArrowDown className="inline mr-1" />
          {trendValue || 'Down'}
        </>
      );
      trendClass = trendUp ? config.trendUp : config.trendDown;
    }

    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendClass}`}>
        {trendContent}
      </span>
    );
  };

  // Render progress bar
  const renderProgressBar = () => {
    if (progress === null) return null;

    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{progressLabel || 'Progress'}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-full rounded-full ${config.progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  // Render comparison
  const renderComparison = () => {
    if (!comparisonValue) return null;

    return (
      <div className="mt-2 flex items-center text-sm">
        <span className="text-gray-600 mr-2">{comparisonLabel || 'vs last period'}:</span>
        <span className={`font-medium ${
          comparisonTrendUp === true ? 'text-green-600' :
          comparisonTrendUp === false ? 'text-red-600' :
          'text-gray-700'
        }`}>
          {comparisonTrendUp === true && <FaArrowUp className="inline mr-1" />}
          {comparisonTrendUp === false && <FaArrowDown className="inline mr-1" />}
          {comparisonValue}
        </span>
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className={`${config.bg} ${bordered ? `border ${config.border}` : ''} ${
        shadow ? 'shadow' : ''
      } rounded-xl p-${compact ? '4' : '5'} animate-pulse ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="h-8 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`bg-red-50 ${bordered ? 'border border-red-100' : ''} ${
        shadow ? 'shadow' : ''
      } rounded-xl p-${compact ? '4' : '5'} ${className} ${
        clickable ? 'cursor-pointer hover:bg-red-100' : ''
      }`}
      onClick={handleClick}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-red-800">{title}</div>
          <div className="text-red-600">
            <FaInfoCircle />
          </div>
        </div>
        <div className="text-red-700 text-sm">{errorMessage}</div>
        <button className="mt-3 text-xs text-red-600 hover:text-red-800">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${config.bg} ${bordered ? `border ${config.border}` : ''} ${
        shadow ? 'shadow' : ''
      } rounded-xl p-${compact ? '4' : '5'} transition-all duration-200 ${
        hoverable ? 'hover:shadow-lg' : ''
      } ${clickable ? 'cursor-pointer hover:-translate-y-1' : ''} ${className}`}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Title and Info */}
        <div className="flex items-center">
          <div className={`text-sm font-medium ${config.text}`}>
            {title}
          </div>
          {showInfo && infoText && (
            <div className="relative group ml-2">
              <FaInfoCircle className="text-gray-400 text-sm cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 w-48">
                  {infoText}
                  <div className="absolute top-full left-3 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side: Icon, Menu, Trend */}
        <div className="flex items-center space-x-2">
          {renderTrend()}
          
          {showMenu && menuItems.length > 0 && (
            <div className="relative">
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                <FaEllipsisV />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {icon && (
            <div className={`p-${compact ? '2' : '3'} rounded-lg ${config.iconBg} ${iconClassName}`}>
              <div className={config.iconColor}>
                {icon}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={contentClassName}>
        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold text-gray-800">
            {value}
          </div>
          {description && (
            <p className={`text-sm ${compact ? 'mt-1' : 'mt-2'} text-gray-600`}>
              {description}
            </p>
          )}
        </div>

        {/* Children (custom content) */}
        {children}

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Comparison */}
        {renderComparison()}

        {/* Footer */}
        {footer || (showLink && (
          <div className={`mt-${compact ? '3' : '4'} pt-${compact ? '3' : '4'} border-t border-gray-200`}>
            <button
              onClick={onLinkClick}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              {linkText}
              <FaExternalLinkAlt className="ml-2 text-xs" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pre-configured card variants
export const StatCard = (props) => (
  <DashboardCard
    compact
    bordered
    shadow
    hoverable
    {...props}
  />
);

export const MetricCard = (props) => (
  <DashboardCard
    showInfo
    bordered={false}
    shadow={false}
    hoverable={false}
    {...props}
  />
);

export const ActionCard = (props) => (
  <DashboardCard
    clickable
    hoverable
    shadow
    className="hover:border-indigo-300"
    {...props}
  />
);

export const ProgressCard = ({ progress, ...props }) => (
  <DashboardCard
    progress={progress}
    showLink
    linkText="View progress"
    {...props}
  />
);

export const ComparisonCard = ({ comparisonValue, comparisonTrendUp, ...props }) => (
  <DashboardCard
    comparisonValue={comparisonValue}
    comparisonTrendUp={comparisonTrendUp}
    showLink
    linkText="Compare details"
    {...props}
  />
);

export default DashboardCard;