export type IdeaStatus = 'DRAFT' | 'SUBMITTED' | 'FLR' | 'SLR' | 'PF' | 'PATENTED' | 'REJECTED';

export type UserRole = 'APPLICANT' | 'REVIEWER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  lineOfBusiness: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  expectedImpact: string;
  status: IdeaStatus;
  applicantId: string;
  coApplicants: string[];
  lineOfBusiness: string;
  createdAt: string;
  updatedAt: string;
  currentReviewerId?: string;
  attachments?: string[];
  rewards?: {
    flrAmount?: number;
    slrAmount?: number;
  };
}

export interface Review {
  id: string;
  ideaId: string;
  reviewerId: string;
  stage: 'FLR' | 'SLR' | 'PF';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments: string;
  createdAt: string;
}