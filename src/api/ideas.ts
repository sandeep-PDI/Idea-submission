import axios from 'axios';
import { Idea } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchUserIdeas = async (): Promise<Idea[]> => {
  const response = await api.get('/ideas');
  return response.data;
};

export const fetchIdeaById = async (id: string): Promise<Idea> => {
  const response = await api.get(`/ideas/${id}`);
  return response.data;
};

export const submitIdea = async (ideaData: Partial<Idea>): Promise<Idea> => {
  const response = await api.post('/ideas', ideaData);
  return response.data;
};

export const updateIdea = async (id: string, ideaData: Partial<Idea>): Promise<Idea> => {
  const response = await api.put(`/ideas/${id}`, ideaData);
  return response.data;
};

export const searchIdeas = async (query: string): Promise<Idea[]> => {
  const response = await api.get(`/ideas/search?q=${encodeURIComponent(query)}`);
  return response.data;
};