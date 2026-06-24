'use client';

import { useState, useMemo } from 'react';
import { createAspectRatioStyle } from '@/utils/layoutShiftUtils';

const DataTable = ({
  columns = [],
  data = [],
  className = '',
  rowKey = 'id',
  loading = false,
  onRowClick,
  sortable = true,
  striped = true,
  hover = true,
  bordered = false,
  responsive = true,
  pagination = null,
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const { pageSize = 10 } = pagination;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pagination]);

  // Handle sort
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle row click
  const handleRowClick = (row, index, e) => {
    if (onRowClick) {
      onRowClick(row, index, e);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-10 bg-gray-200 rounded mb-2"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  // Render empty state
  if (data.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        No data available
      </div>
    );
  }

  // Get the data to display (paginated or all)
  const displayData = pagination ? paginatedData : sortedData;

  return (
    <div className={`${responsive ? 'overflow-x-auto' : ''} ${className}`}>
      <div className="min-w-full">
        <div className={`bg-white shadow-sm rounded-lg overflow-hidden ${bordered ? 'border border-gray-200' : ''}`}>
          {/* Header */}
          <div 
            className="grid bg-gray-50" 
            style={{ 
              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            {columns.map((column) => (
              <div 
                key={column.key} 
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  sortable && column.sortable !== false ? 'cursor-pointer select-none' : ''
                }`}
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.header}
                  {sortable && column.sortable !== false && (
                    <span className="ml-1 text-xs">
                      {sortConfig.key === column.key 
                        ? sortConfig.direction === 'asc' ? '↑' : '↓'
                        : '⇅'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Rows */}
          <div className="bg-white divide-y divide-gray-200">
            {displayData.map((row, rowIndex) => (
              <div 
                key={row[rowKey] || rowIndex}
                className={`grid ${hover ? 'hover:bg-gray-50' : ''} ${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : ''} ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                style={{ 
                  gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` 
                }}
                onClick={(e) => handleRowClick(row, rowIndex, e)}
              >
                {columns.map((column, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {pagination && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">
                    {Math.min((currentPage - 1) * pagination.pageSize + 1, data.length)}
                  </span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pagination.pageSize, data.length)}
                  </span> of <span className="font-medium">{data.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.length / pagination.pageSize)))}
                    disabled={currentPage >= Math.ceil(data.length / pagination.pageSize)}
                    className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
