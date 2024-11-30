import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { XIcon } from 'lucide-react';
import { ideaService } from '../services/api'
interface ReviewModalProps {
 
  ideaId: string;
  onClose: () => void;
  onSubmit: () => void;
}

interface ReviewForm {
  stage: 'FLR' | 'SLR' | 'PF';
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  comments: string;
}

function ReviewModal({ ideaId, onClose, onSubmit }: ReviewModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewForm>();

  const submitReviewMutation = useMutation(
    async (data: ReviewForm) => {
      // const response = await fetch(`/api/ideas/${ideaId}/reviews`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) throw new Error('Failed to submit review');
      // return response.json();
      const response = await ideaService.addReview(ideaId, data);
      if (!response) throw new Error('Failed to submit review');
      return response;
    },
    {
      onSuccess: () => {
        onSubmit();
      },
    }
  );

  const onSubmitForm = (data: ReviewForm) => {
    submitReviewMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="relative bg-white rounded-lg max-w-lg w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Review</h2>

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Review Stage
                </label>
                <select
                  {...register('stage', { required: 'Review stage is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="FLR">First Level Review (FLR)</option>
                  <option value="SLR">Second Level Review (SLR)</option>
                  <option value="PF">Patent Filing (PF)</option>
                </select>
                {errors.stage && (
                  <p className="mt-1 text-sm text-red-600">{errors.stage.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="PENDING">Pending</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comments
                </label>
                <textarea
                  {...register('comments', { required: 'Comments are required' })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Provide detailed feedback..."
                />
                {errors.comments && (
                  <p className="mt-1 text-sm text-red-600">{errors.comments.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitReviewMutation.isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;