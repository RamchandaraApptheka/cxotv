'use client';

import { useState, useMemo } from 'react';
import { createAspectRatioStyle } from '@/utils/layoutShiftUtils';

export default function DataGrid({
  columns,
  data,
  className = '',
  rowKey = 'id',
  loading = false,
  onRowClick,
  ...props
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

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

  return (
    <div className={`overflow-x-auto ${className}`} {...props}>
      <div className="min-w-full">
        <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg overflow-hidden">
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => column.sortable !== false && requestSort(column.key)}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable !== false && (
                    <span className="ml-1 text-xs">
                      {getSortIcon(column.key)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Rows */}
          <div className="bg-white divide-y divide-gray-200">
            {sortedData.length > 0 ? (
              sortedData.map((row, rowIndex) => (
                <div 
                  key={row[rowKey] || rowIndex}
                  className={`grid hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  style={{ 
                    gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` 
                  }}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((column, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
