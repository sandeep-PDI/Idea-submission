import axios from 'axios';
import type { User } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const auth = {
  login: async (email: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email });
    return data;
  }
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

  create: async (ideaData: any) => {
    const { data } = await api.post('/ideas', ideaData);
    return data;
  },

  addReview: async (ideaId: string, reviewData: any) => {
    const { data } = await api.post(`/ideas/${ideaId}/reviews`, reviewData);
    return data;
  }
};