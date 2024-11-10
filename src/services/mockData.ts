import type { Idea, User, Review, Attachment } from '../types';

export const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'AI-Powered Code Review Assistant',
    description: 'An intelligent system that automatically reviews code changes and suggests improvements based on best practices and historical data.',
    expectedImpact: 'Reduce code review time by 40% and improve code quality across all projects.',
    status: 'SUBMITTED',
    submittedBy: 'John Doe',
    coApplicants: ['Jane Smith'],
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
    attachments: [],
    reviews: [],
    lineOfBusiness: 'SOFTWARE'
  },
  {
    id: '2',
    title: 'Quantum-Resistant Encryption Protocol',
    description: 'A new encryption protocol designed to withstand attacks from quantum computers while maintaining high performance.',
    expectedImpact: 'Future-proof our security infrastructure and create new revenue streams through licensing.',
    status: 'FLR',
    submittedBy: 'Alice Johnson',
    coApplicants: [],
    createdAt: '2024-02-10T15:45:00Z',
    updatedAt: '2024-02-12T09:20:00Z',
    attachments: [],
    reviews: [],
    lineOfBusiness: 'RESEARCH'
  },
  {
    id: '3',
    title: 'Self-Healing Network Infrastructure',
    description: 'An autonomous system that detects and repairs network issues using machine learning and predictive analytics.',
    expectedImpact: 'Reduce network downtime by 90% and decrease maintenance costs by 60%.',
    status: 'SLR',
    submittedBy: 'Bob Wilson',
    coApplicants: ['Carol Brown', 'David Lee'],
    createdAt: '2024-02-01T08:15:00Z',
    updatedAt: '2024-02-14T16:30:00Z',
    attachments: [],
    reviews: [],
    lineOfBusiness: 'HARDWARE'
  }
];