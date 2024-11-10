import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, XIcon, UploadIcon } from 'lucide-react';

interface IdeaSubmissionForm {
  title: string;
  description: string;
  expectedImpact: string;
  lineOfBusiness: string;
  coApplicants: string[];
}

function IdeaSubmission() {
  const navigate = useNavigate();
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IdeaSubmissionForm>();

  const submitMutation = useMutation(
    async (data: IdeaSubmissionForm & { attachments: File[] }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'coApplicants') {
          formData.append(key, JSON.stringify(value));
        } else if (key !== 'attachments') {
          formData.append(key, value);
        }
      });
      
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch('/api/ideas', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Failed to submit idea');
      return response.json();
    },
    {
      onSuccess: () => {
        navigate('/dashboard');
      },
    }
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: IdeaSubmissionForm) => {
    submitMutation.mutate({ ...data, attachments });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit New Idea</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expected Impact</label>
          <textarea
            {...register('expectedImpact', { required: 'Expected impact is required' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.expectedImpact && (
            <p className="mt-1 text-sm text-red-600">{errors.expectedImpact.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Line of Business</label>
          <select
            {...register('lineOfBusiness', { required: 'Line of Business is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Line of Business</option>
            <option value="SOFTWARE">Software</option>
            <option value="HARDWARE">Hardware</option>
            <option value="SERVICES">Services</option>
            <option value="RESEARCH">Research</option>
          </select>
          {errors.lineOfBusiness && (
            <p className="mt-1 text-sm text-red-600">{errors.lineOfBusiness.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Attachments</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB each</p>
            </div>
          </div>
          {attachments.length > 0 && (
            <ul className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-md"
                >
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitMutation.isLoading}
            // add functionality to save the idea in the DB

            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {submitMutation.isLoading ? 'Submitting...' : 'Submit Idea'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default IdeaSubmission;