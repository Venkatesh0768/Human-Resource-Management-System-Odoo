import React, { useState, useMemo } from 'react';
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaPrint,
  FaTimes,
  FaCheck,
  FaTimesCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDoubleLeft,
  FaChevronDoubleRight
} from 'react-icons/fa';

const DataTable = ({
  // Data props
  data = [],
  columns = [],
  
  // Configuration props
  title = 'Data Table',
  description = '',
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  selectable = false,
  actions = true,
  
  // Display props
  pageSizeOptions = [5, 10, 25, 50, 100],
  defaultPageSize = 10,
  defaultSortColumn = '',
  defaultSortDirection = 'asc',
  
  // Styling props
  compact = false,
  striped = true,
  hoverable = true,
  bordered = true,
  
  // Event handlers
  onRowClick = null,
  onEdit = null,
  onDelete = null,
  onView = null,
  onSelect = null,
  onExport = null,
  onPrint = null,
  
  // Custom renderers
  renderActions = null,
  renderEmptyState = null,
  renderLoadingState = null,
  renderFilters = null,
  
  // State
  loading = false,
  error = null,
  
  // Additional features
  bulkActions = [],
  rowClassName = '',
  headerClassName = '',
  
  // Customization
  searchPlaceholder = 'Search...',
  showSummary = true,
  showPageInfo = true,
  
  // Responsive
  responsive = true,
  scrollable = false,
  maxHeight = null
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortConfig, setSortConfig] = useState({
    key: defaultSortColumn,
    direction: defaultSortDirection
  });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  // Apply filters and search
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply global search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        columns.some(col => {
          if (!col.searchable && col.searchable !== undefined) return false;
          const value = row[col.key];
          return value && value.toString().toLowerCase().includes(term);
        })
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(row => {
          const cellValue = row[key];
          if (Array.isArray(value)) {
            return value.includes(cellValue);
          }
          return cellValue === value || cellValue?.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply global filter
    if (globalFilter) {
      filtered = filtered.filter(row =>
        Object.values(row).some(val =>
          val?.toString().toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }

    return filtered;
  }, [data, searchTerm, filters, globalFilter, columns]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested properties
      if (sortConfig.key.includes('.')) {
        aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
        bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);
      }

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Calculate totals
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const totalItems = sortedData.length;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Sort handler
  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = paginatedData.map((row, index) => row.id || index);
      setSelectedRows(new Set(allIds));
      onSelect?.(allIds);
    } else {
      setSelectedRows(new Set());
      onSelect?.([]);
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    onSelect?.(Array.from(newSelected));
  };

  // Filter handlers
  const handleFilterChange = (columnKey, value) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setGlobalFilter('');
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Export handlers
  const handleExport = (format = 'csv') => {
    if (onExport) {
      onExport(sortedData, format);
    } else {
      // Default CSV export
      const headers = columns.map(col => col.title).join(',');
      const csvContent = [
        headers,
        ...sortedData.map(row =>
          columns.map(col => {
            let value = row[col.key];
            if (col.render) {
              const element = col.render(row[col.key], row);
              value = element?.props?.children || element;
            }
            return `"${String(value || '').replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  // Render cell content
  const renderCell = (row, column) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }

    // Default renderers for common data types
    if (column.type === 'boolean') {
      return value ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaCheckCircle className="mr-1" />
          Yes
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FaTimesCircle className="mr-1" />
          No
        </span>
      );
    }

    if (column.type === 'status') {
      const statusConfig = {
        active: { color: 'green', icon: <FaCheckCircle /> },
        pending: { color: 'yellow', icon: <FaExclamationCircle /> },
        inactive: { color: 'red', icon: <FaTimesCircle /> },
        approved: { color: 'green', icon: <FaCheck /> },
        rejected: { color: 'red', icon: <FaTimes /> }
      };
      
      const config = statusConfig[value] || { color: 'gray', icon: null };
      
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}>
          {config.icon && <span className="mr-1">{config.icon}</span>}
          {column.formatStatus?.(value) || value}
        </span>
      );
    }

    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }

    if (column.type === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: column.currency || 'USD'
      }).format(value);
    }

    if (column.type === 'number' && typeof value === 'number') {
      return new Intl.NumberFormat().format(value);
    }

    if (column.type === 'percentage' && typeof value === 'number') {
      return `${value}%`;
    }

    // Default fallback
    return value || '-';
  };

  // Render filter input
  const renderFilterInput = (column) => {
    if (!column.filterable && column.filterable !== undefined) return null;

    if (column.filterType === 'select' && column.filterOptions) {
      return (
        <select
          value={filters[column.key] || 'all'}
          onChange={(e) => handleFilterChange(column.key, e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All {column.title}</option>
          {column.filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (column.filterType === 'date') {
      return (
        <input
          type="date"
          value={filters[column.key] || ''}
          onChange={(e) => handleFilterChange(column.key, e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      );
    }

    // Default text filter
    return (
      <input
        type="text"
        placeholder={`Filter ${column.title}`}
        value={filters[column.key] || ''}
        onChange={(e) => handleFilterChange(column.key, e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      />
    );
  };

  // Render sort icon
  const renderSortIcon = (column) => {
    if (!sortable || !column.sortable) return null;
    
    if (sortConfig.key === column.key) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  // Render actions
  const renderRowActions = (row) => {
    if (renderActions) {
      return renderActions(row);
    }

    return (
      <div className="flex items-center space-x-2">
        {onView && (
          <button
            onClick={() => onView(row)}
            className="text-blue-600 hover:text-blue-900 p-1"
            title="View"
          >
            <FaEye />
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(row)}
            className="text-green-600 hover:text-green-900 p-1"
            title="Edit"
          >
            <FaEdit />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(row)}
            className="text-red-600 hover:text-red-900 p-1"
            title="Delete"
          >
            <FaTrash />
          </button>
        )}
      </div>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (renderEmptyState) {
      return renderEmptyState();
    }

    return (
      <tr>
        <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-6 py-12 text-center">
          <div className="flex flex-col items-center">
            <div className="text-gray-400 text-4xl mb-4">
              📊
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
            <p className="text-gray-500 max-w-md">
              {searchTerm || Object.keys(filters).length > 0
                ? 'No records match your search or filters. Try adjusting your criteria.'
                : 'No records available. Add some data to get started.'}
            </p>
            {(searchTerm || Object.keys(filters).length > 0) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  // Render loading state
  const renderLoading = () => {
    if (renderLoadingState) {
      return renderLoadingState();
    }

    return (
      <tr>
        <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-6 py-12 text-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </td>
      </tr>
    );
  };

  // Table classes
  const tableClasses = `
    ${bordered ? 'border' : ''}
    ${striped ? 'divide-y divide-gray-200' : ''}
    ${responsive ? 'w-full' : ''}
    ${compact ? 'text-sm' : 'text-base'}
  `;

  const rowClasses = (row, index) => `
    ${hoverable ? 'hover:bg-gray-50 transition-colors' : ''}
    ${striped && index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
    ${rowClassName}
  `;

  // Error handling
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <FaTimesCircle className="text-red-500 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
            <p className="text-red-700">{error.message || 'Failed to load data'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Export & Print */}
            {onExport && (
              <button
                onClick={() => handleExport()}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition flex items-center"
              >
                <FaDownload className="mr-2" />
                Export
              </button>
            )}
            
            {onPrint && (
              <button
                onClick={onPrint}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition flex items-center"
              >
                <FaPrint className="mr-2" />
                Print
              </button>
            )}
            
            {/* Filter Toggle */}
            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center ${
                  showFilters
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaFilter className="mr-2" />
                Filters
                {Object.keys(filters).length > 0 && (
                  <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Global Search */}
            {searchable && (
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}

            {/* Page Size Selector */}
            {pagination && (
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Show:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span className="text-gray-700 ml-2">entries</span>
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && filterable && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Advanced Filters</h4>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              </div>
              
              {renderFilters ? (
                renderFilters(filters, handleFilterChange, clearFilters)
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {columns
                    .filter(col => col.filterable !== false)
                    .map(column => (
                      <div key={column.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {column.title}
                        </label>
                        {renderFilterInput(column)}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectable && selectedRows.size > 0 && bulkActions.length > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-indigo-700 font-medium">
                {selectedRows.size} item{selectedRows.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {bulkActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => action.onClick(Array.from(selectedRows))}
                  className={`px-3 py-1 rounded text-sm font-medium ${action.className || 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  {action.icon && <span className="mr-1">{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className={`${scrollable ? 'overflow-auto' : ''}`} style={maxHeight ? { maxHeight } : {}}>
        <table className={tableClasses}>
          <thead className="bg-gray-50">
            <tr>
              {/* Select All Checkbox */}
              {selectable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
              )}

              {/* Column Headers */}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${headerClassName} ${
                    column.align === 'center' ? 'text-center' :
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={column.width ? { width: column.width } : {}}
                >
                  <div className={`flex items-center ${column.sortable ? 'cursor-pointer hover:text-gray-700' : ''}`}>
                    <span onClick={() => column.sortable && handleSort(column.key)}>
                      {column.title}
                    </span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {renderSortIcon(column)}
                      </button>
                    )}
                  </div>
                </th>
              ))}

              {/* Actions Column Header */}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {/* Loading State */}
            {loading && renderLoading()}

            {/* Empty State */}
            {!loading && paginatedData.length === 0 && renderEmpty()}

            {/* Data Rows */}
            {!loading && paginatedData.length > 0 && paginatedData.map((row, index) => (
              <tr
                key={row.id || index}
                className={rowClasses(row, index)}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {/* Row Selection Checkbox */}
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id || index)}
                      onChange={() => handleSelectRow(row.id || index)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}

                {/* Data Cells */}
                {columns.map(column => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 ${compact ? 'py-2' : 'py-4'} whitespace-nowrap ${
                      column.align === 'center' ? 'text-center' :
                      column.align === 'right' ? 'text-right' : 'text-left'
                    } ${column.className || ''}`}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}

                {/* Actions Cell */}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div onClick={(e) => e.stopPropagation()}>
                      {renderRowActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination and Summary */}
      {(pagination || showSummary) && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Summary */}
            {showSummary && (
              <div className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {totalItems} entries
                {searchTerm && ` (filtered from ${data.length} total entries)`}
              </div>
            )}

            {/* Pagination */}
            {pagination && totalPages > 1 && (
              <div className="flex items-center space-x-2">
                {/* First Page */}
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <FaChevronDoubleLeft />
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous Page"
                >
                  <FaChevronLeft />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => goToPage(i)}
                          className={`px-3 py-1 rounded-lg font-medium ${
                            currentPage === i
                              ? 'bg-indigo-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next Page"
                >
                  <FaChevronRight />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <FaChevronDoubleRight />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;