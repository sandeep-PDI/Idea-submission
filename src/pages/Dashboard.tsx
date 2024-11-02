import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  LightbulbIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ChevronRightIcon
} from 'lucide-react';
import { fetchUserIdeas } from '../api/ideas';
import { Idea, IdeaStatus } from '../types';

const statusColors: Record<IdeaStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  FLR: 'bg-yellow-100 text-yellow-800',
  SLR: 'bg-purple-100 text-purple-800',
  PF: 'bg-orange-100 text-orange-800',
  PATENTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
};

const statusIcons: Record<IdeaStatus, React.ReactNode> = {
  DRAFT: <ClockIcon className="h-5 w-5" />,
  SUBMITTED: <ClockIcon className="h-5 w-5" />,
  FLR: <LightbulbIcon className="h-5 w-5" />,
  SLR: <LightbulbIcon className="h-5 w-5" />,
  PF: <LightbulbIcon className="h-5 w-5" />,
  PATENTED: <CheckCircleIcon className="h-5 w-5" />,
  REJECTED: <XCircleIcon className="h-5 w-5" />
};

function Dashboard() {
  const { data: ideas, isLoading } = useQuery({
    queryKey: ['userIdeas'],
    queryFn: fetchUserIdeas
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Ideas Dashboard</h1>
        <Link
          to="/submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <LightbulbIcon className="h-5 w-5 mr-2" />
          Submit New Idea
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {ideas?.map((idea: Idea) => (
            <li key={idea.id}>
              <Link to={`/ideas/${idea.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[idea.status]}`}>
                        {statusIcons[idea.status]}
                        <span className="ml-1">{idea.status}</span>
                      </span>
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {idea.title}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {idea.rewards && (
                        <div className="mr-4 flex items-center text-sm text-gray-500">
                          <span className="font-medium text-green-600">
                            ${(idea.rewards.flrAmount || 0) + (idea.rewards.slrAmount || 0)}
                          </span>
                        </div>
                      )}
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {idea.description}
                    </p>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span>Submitted on {new Date(idea.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                    {idea.coApplicants.length > 0 && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {idea.coApplicants.length} co-applicant{idea.coApplicants.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;