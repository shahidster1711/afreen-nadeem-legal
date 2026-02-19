export type SubmissionStatus = 'new' | 'in_review' | 'awaiting_client' | 'responded' | 'closed';

export interface Submission {
  id: string;
  name: string;
  email: string;
  requirement_type: string;
  description: string;
  urgency: string;
  status: SubmissionStatus;
  notes: string | null;
  document_urls: string[] | null;
  created_at: string;
  updated_at: string;
}
