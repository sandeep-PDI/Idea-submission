import React from 'react';
import { useQuery } from 'react-query';
import { SearchIcon, AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import IdeaCard from '../components/IdeaCard';
import { ideaService } from '../services/api';
import type { Idea } from '../types';

function Dashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { data: ideas = [], isLoading, error } = useQuery<Idea[]>(
    'ideas',
    ideaService.getAll,
    {
      retry: 2,
      refetchOnWindowFocus: false,
    }
  );

  const filteredIdeas = React.useMemo(() => {
    if (!ideas) return [];
    return ideas
    // return ideas.filter(
    //   (idea) =>
    //     // idea.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     // idea.description?.toLowerCase().includes(searchTerm.toLowerCase())
    // );
  }, [ideas, searchTerm]);

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Ideas</h2>
          <p className="text-gray-600 mb-4">{(error as Error).message}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Ideas</h1>
        <Link
          to="/submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit New Idea
        </Link>
      </div>

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
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ideas...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.length > 0 ? (
            filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))
          ) : (
            <div className="col-span-full min-h-[30vh] flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? 'No ideas found matching your search criteria.'
                    : 'No ideas found. Start by submitting a new idea!'}
                </p>
                <Link
                  to="/submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit New Idea
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;