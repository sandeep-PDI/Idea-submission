import React from 'react';
import { useForm } from 'react-hook-form';
import { PlusIcon, XIcon, SearchIcon } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { searchIdeas, submitIdea } from '../api/ideas';

interface IdeaFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

function IdeaForm({ onSubmit, initialData }: IdeaFormProps) {
  const [coApplicants, setCoApplicants] = React.useState<string[]>(initialData?.coApplicants || []);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  const searchQuery = useQuery({
    queryKey: ['searchIdeas', searchTerm],
    queryFn: () => searchIdeas(searchTerm),
    enabled: searchTerm.length > 2
  });

  const submitMutation = useMutation({
    mutationFn: submitIdea,
    onSuccess: () => {
      // Handle success
    }
  });

  const addCoApplicant = (email: string) => {
    if (coApplicants.length < 4 && !coApplicants.includes(email)) {
      setCoApplicants([...coApplicants, email]);
    }
  };

  const removeCoApplicant = (email: string) => {
    setCoApplicants(coApplicants.filter(e => e !== email));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Search Similar Ideas
        </label>
        <div className="mt-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Search before submitting..."
          />
          <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {searchQuery.data && searchQuery.data.length > 0 && (
          <div className="mt-2 p-2 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-700">
              Similar ideas found. Please review before submitting.
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          {...register('title', { required: true })}
          className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">Title is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description', { required: true })}
          rows={4}
          className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">Description is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Expected Impact
        </label>
        <textarea
          {...register('expectedImpact', { required: true })}
          rows={3}
          className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        />
        {errors.expectedImpact && (
          <p className="mt-1 text-sm text-red-600">Expected impact is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Co-Applicants (max 4)
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="email"
            placeholder="Enter email address"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.target as HTMLInputElement;
                addCoApplicant(input.value);
                input.value = '';
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const input = document.querySelector('input[type="email"]') as HTMLInputElement;
              addCoApplicant(input.value);
              input.value = '';
            }}
            className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {coApplicants.map((email) => (
            <span
              key={email}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
            >
              {email}
              <button
                type="button"
                onClick={() => removeCoApplicant(email)}
                className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-600 hover:text-indigo-800 focus:outline-none"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Attachments
        </label>
        <input
          type="file"
          multiple
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Idea
        </button>
      </div>
    </form>
  );
}

export default IdeaForm;