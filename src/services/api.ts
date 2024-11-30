import axios from 'axios';
import type { User } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Add an interceptor to attach the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  console.log('token', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email });
    localStorage.setItem('token', data.token);
    return data;
  },
  register: async (email: string, password: string, name: string, department : string, lineofbusiness : string): Promise<User> => {
    const { data } = await api.post('/auth/register', { email, password, name, department, lineofbusiness });
    return data;
  },
};

export const ideaService = {
  getAll: async () => {
    const { data } = await api.get('/ideas');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/ideas/${id}`);
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await api.post('/ideas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the correct content type
      },
    });
    return data;
  },

  addReview: async (ideaId: string, reviewData: any) => {
    const { data } = await api.post(`/ideas/${ideaId}/reviews`, reviewData);
    return data;
  },
  lineOfBusinessIdeas: async () => {
    const { data } = await api.get('/ideas/line-of-business');
    return data;
  }
};

// User endpoints
export const userService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    return data;
  },

  // Get a user by ID
  getById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
  updateRole: async (userId: string, role: string): Promise<User> => {
    const { data } = await api.put(`/users/${userId}/role`, { role });
    return data;
  },
  delete: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};