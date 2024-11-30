import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UserCogIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';
import type { User } from '../types';
import { userService } from '../services/api';
function AdminPanel() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const { data: users, isLoading } = useQuery<User[]>('users', async () => {
    const response = await userService.getAll();
    if (!response) throw new Error('Failed to fetch users');
    return response;
  });

  const updateUserMutation = useMutation(
    async ({ userId, role }: { userId: string; role: string }) => {
      const response = await userService.updateRole(userId, role);
      if (!response) throw new Error('Failed to update user role');
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const deleteUserMutation = useMutation(
    async (userId: string) => {
      const response = await userService.delete(userId);
      if (!response) throw new Error('Failed to delete user');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    if (!selectedRole) return users;
    return users.filter((user) => user.role === selectedRole);
  }, [users, selectedRole]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage user roles and permissions for the idea submission system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Roles</option>
            <option value="APPLICANT">Applicants</option>
            <option value="REVIEWER">Reviewers</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Line of Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCogIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lineofbusiness}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateUserMutation.mutate({
                          userId: user.id,
                          role: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="APPLICANT">Applicant</option>
                      <option value="REVIEWER">Reviewer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this user?')) {
                          deleteUserMutation.mutate(user.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;