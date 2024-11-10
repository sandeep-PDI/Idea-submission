import React from 'react';
import { FilterIcon } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

interface FilterState {
  status: string[];
  lineOfBusiness: string[];
  dateRange: string;
}

function FilterPanel({ onFilterChange, initialFilters }: FilterPanelProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    status: initialFilters?.status || [],
    lineOfBusiness: initialFilters?.lineOfBusiness || [],
    dateRange: initialFilters?.dateRange || 'all',
  });

  const handleStatusChange = (status: string) => {
    const updatedStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    
    const newFilters = { ...filters, status: updatedStatus };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLoBChange = (lob: string) => {
    const updatedLoB = filters.lineOfBusiness.includes(lob)
      ? filters.lineOfBusiness.filter((l) => l !== lob)
      : [...filters.lineOfBusiness, lob];
    
    const newFilters = { ...filters, lineOfBusiness: updatedLoB };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (range: string) => {
    const newFilters = { ...filters, dateRange: range };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <FilterIcon className="h-5 w-5 text-gray-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
          <div className="space-y-2">
            {['DRAFT', 'SUBMITTED', 'FLR', 'SLR', 'PF', 'PATENTED', 'REJECTED'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Line of Business</h3>
          <div className="space-y-2">
            {['SOFTWARE', 'HARDWARE', 'SERVICES', 'RESEARCH'].map((lob) => (
              <label key={lob} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.lineOfBusiness.includes(lob)}
                  onChange={() => handleLoBChange(lob)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{lob}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Date Range</h3>
          <select
            value={filters.dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <button
          onClick={() => {
            setFilters({
              status: [],
              lineOfBusiness: [],
              dateRange: 'all',
            });
            onFilterChange({
              status: [],
              lineOfBusiness: [],
              dateRange: 'all',
            });
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;