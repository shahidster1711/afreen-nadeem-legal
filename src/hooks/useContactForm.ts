import { useState, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { storageService } from '@/services/storage.service';
import { functionsService } from '@/services/functions.service';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'text/plain',
];

export interface UploadedFile {
  file: File;
  name: string;
  size: string;
}

interface FormData {
  name: string;
  email: string;
  requirementType: string;
  description: string;
  urgency: string;
  honeypot: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  requirementType: '',
  description: '',
  urgency: '',
  honeypot: '',
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const useContactForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: 'File too large', description: `${file.name} exceeds 10MB limit`, variant: 'destructive' });
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({ title: 'Invalid file type', description: `${file.name} - Only PDF, DOC, DOCX, JPG, PNG, TXT allowed`, variant: 'destructive' });
        continue;
      }

      setFiles((prev) => {
        if (prev.some((f) => f.name === file.name)) return prev;
        if (prev.length >= 5) {
          toast({ title: 'Maximum files reached', description: 'You can upload up to 5 documents', variant: 'destructive' });
          return prev;
        }
        return [...prev, { file, name: file.name, size: formatFileSize(file.size) }];
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const removeFile = useCallback((fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length > 100) newErrors.name = 'Name must be less than 100 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';

    if (!formData.requirementType) newErrors.requirementType = 'Please select a requirement type';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length > 2000) newErrors.description = 'Description must be less than 2000 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const uploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) return [];
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const fileData of files) {
        const timestamp = Date.now();
        const sanitizedName = fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `client-documents/${timestamp}_${sanitizedName}`;
        const downloadUrl = await storageService.uploadFile(fileData.file, filePath);
        uploadedUrls.push(downloadUrl);
      }
      return uploadedUrls;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const documentUrls = await uploadFiles();

      await functionsService.call('sendContactEmail', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        requirementType: formData.requirementType,
        description: formData.description.trim(),
        urgency: formData.urgency || 'normal',
        documentUrls,
        honeypot: formData.honeypot,
      });

      toast({
        title: 'Enquiry Submitted Successfully',
        description: `I'll review your requirement${files.length > 0 ? ` and ${files.length} document(s)` : ''} and get back to you within 24 hours.`,
      });

      setFormData(initialFormData);
      setFiles([]);
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your enquiry. Please try again or email directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    files,
    isSubmitting,
    isUploading,
    errors,
    fileInputRef,
    updateField,
    handleFileSelect,
    removeFile,
    handleSubmit,
  };
};
