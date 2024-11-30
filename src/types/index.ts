export type UserRole = 'APPLICANT' | 'REVIEWER' | 'ADMIN';

export type IdeaStatus = 'DRAFT' | 'SUBMITTED' | 'FLR' | 'SLR' | 'PF' | 'PATENTED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  lineOfBusiness: string;
  createdat: string;
  updatedat: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  expectedImpact: string;
  status: IdeaStatus;
  submittedBy: string;
  coApplicants: string[];
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  reviews: Review[];
  lineOfBusiness: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Review {
  id: string;
  ideaId: string;
  reviewerId: string;
  stage: 'FLR' | 'SLR' | 'PF';
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  comments: string;
  createdAt: string;
}