-- Create contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT DEFAULT 'normal',
  document_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'archived')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only allow inserts from anyone (public form submissions)
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- No public SELECT - only backend/admin can view submissions
-- This protects client data from being exposed

-- Create storage bucket for client documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-documents',
  'client-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'text/plain']
);

-- Storage policy: Anyone can upload documents (for contact form)
CREATE POLICY "Anyone can upload client documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'client-documents');

-- Storage policy: Only authenticated/service role can read documents
CREATE POLICY "Service role can read client documents"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'client-documents' AND auth.role() = 'service_role');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_contact_updated_at();