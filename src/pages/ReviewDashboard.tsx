import React from 'react';
import { useQuery } from 'react-query';
import { SearchIcon } from 'lucide-react';
import type { Idea } from '../types';
import IdeaCard from '../components/IdeaCard';
import FilterPanel from '../components/FilterPanel';
import { ideaService } from '../services/api';
function ReviewDashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    status: [],
    lineOfBusiness: [],
    dateRange: 'all',
  });

  const { data: ideas, isLoading } = useQuery<Idea[]>('ideasForReview', async () => {
    const response = await ideaService.lineOfBusinessIdeas();
    if (!response) throw new Error('Failed to fetch ideas for review');
    return response;
  });

  const filteredIdeas = React.useMemo(() => {
    if (!ideas) return [];

    return ideas.filter((idea) => {
      const matchesSearch =
        searchTerm === '' ||
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(idea.status);

      const matchesLoB =
        filters.lineOfBusiness.length === 0 ||
        filters.lineOfBusiness.includes(idea.lineOfBusiness);

      // Date filtering logic can be expanded based on requirements
      const matchesDate = true; // Placeholder

      return matchesSearch && matchesStatus && matchesLoB && matchesDate;
    });
  }, [ideas, searchTerm, filters]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and evaluate submitted ideas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel
            onFilterChange={setFilters}
            initialFilters={filters}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ideas..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading ideas...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
              {filteredIdeas.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No ideas found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewDashboard;