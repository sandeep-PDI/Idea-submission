import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRightIcon, UserIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import type { Idea } from '../types';

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  FLR: 'bg-yellow-100 text-yellow-800',
  SLR: 'bg-purple-100 text-purple-800',
  PF: 'bg-orange-100 text-orange-800',
  PATENTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

interface IdeaCardProps {
  idea: Idea;
  showActions?: boolean;
}

function IdeaCard({ idea, showActions = true }: IdeaCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex-1">{idea.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[idea.status]}`}>
          {idea.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{idea.description}</p>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 mr-1" />
          <span>{idea.submittedBy}</span>
        </div>
        <div>
          {idea.coApplicants && idea.coApplicants.length > 0 && `+${idea.coApplicants.length} co-applicants`}
        </div>
        <div>
        {idea.createdAt ? format(new Date(idea.createdAt), 'MMM d, yyyy') : 'Invalid date'}
      </div>
      </div>

      {showActions && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            {idea.attachments && idea.attachments.length > 0 && (
              <span className="text-sm text-gray-500">
                {idea.attachments.length} attachment{idea.attachments.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <Link
            to={`/ideas/${idea.id}`}
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-500"
          >
            <span>View Details</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default IdeaCard;