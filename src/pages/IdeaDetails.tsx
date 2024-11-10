import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { FileIcon, UserIcon, MessageSquareIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import type { Idea, Review } from '../types';
import ReviewModal from '../components/ReviewModal';

function IdeaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);

  const { data: idea, isLoading } = useQuery<Idea>(['idea', id], async () => {
    const response = await fetch(`/api/ideas/${id}`);
    if (!response.ok) throw new Error('Failed to fetch idea');
    return response.json();
  });

  const updateStatusMutation = useMutation(
    async ({ status }: { status: string }) => {
      const response = await fetch(`/api/ideas/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['idea', id]);
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Idea not found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{idea.title}</h1>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
              {idea.status}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{idea.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Expected Impact</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{idea.expectedImpact}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Team</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900 font-medium">Submitted by:</span>
                  <span className="ml-2 text-gray-700">{idea.submittedBy}</span>
                </div>
                {idea.coApplicants.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-gray-900 font-medium">Co-applicants:</span>
                    <span className="ml-2 text-gray-700">
                      {idea.coApplicants.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {idea.attachments.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Attachments</h2>
                <div className="grid grid-cols-1 gap-4">
                  {idea.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <FileIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{attachment.fileName}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              {idea.reviews.length > 0 ? (
                <div className="space-y-4">
                  {idea.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {review.stage} Review
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          review.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : review.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {review.status}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{review.comments}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
              
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <MessageSquareIcon className="h-5 w-5 mr-2" />
                Add Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {isReviewModalOpen && (
        <ReviewModal
          ideaId={idea.id}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={() => {
            setIsReviewModalOpen(false);
            queryClient.invalidateQueries(['idea', id]);
          }}
        />
      )}
    </div>
  );
}

export default IdeaDetails;