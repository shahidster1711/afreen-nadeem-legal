import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Shield, Clock, Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { storageService } from "@/services/storage.service";
import { functionsService } from "@/services/functions.service";

const requirementTypes = [
  "Legal Opinion",
  "Contract Drafting",
  "Contract Review",
  "Legal Documentation",
  "Compliance Advisory",
  "Website/App Policies",
  "Legal Research",
  "Academic Writing",
  "Other",
];

const urgencyOptions = [
  { value: "normal", label: "Normal (5-7 days)" },
  { value: "priority", label: "Priority (2-3 days)" },
  { value: "urgent", label: "Urgent (24-48 hours)" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'text/plain'
];

interface UploadedFile {
  file: File;
  name: string;
  size: string;
}

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    requirementType: "",
    description: "",
    urgency: "",
    honeypot: "",
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    for (const file of selectedFiles) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        continue;
      }

      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} - Only PDF, DOC, DOCX, JPG, PNG, TXT allowed`,
          variant: "destructive",
        });
        continue;
      }

      // Check for duplicates
      if (files.some(f => f.name === file.name)) {
        continue;
      }

      // Add to files list (max 5 files)
      if (files.length < 5) {
        setFiles(prev => [...prev, {
          file,
          name: file.name,
          size: formatFileSize(file.size),
        }]);
      } else {
        toast({
          title: "Maximum files reached",
          description: "You can upload up to 5 documents",
          variant: "destructive",
        });
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.requirementType) {
      newErrors.requirementType = "Please select a requirement type";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files first
      const documentUrls = await uploadFiles();

      await functionsService.call('sendContactEmail', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        requirementType: formData.requirementType,
        description: formData.description.trim(),
        urgency: formData.urgency || "normal",
        documentUrls,
        honeypot: formData.honeypot,
      });

      toast({
        title: "Enquiry Submitted Successfully",
        description: `I'll review your requirement${files.length > 0 ? ` and ${files.length} document(s)` : ''} and get back to you within 24 hours.`,
      });

      setFormData({
        name: "",
        email: "",
        requirementType: "",
        description: "",
        urgency: "",
        honeypot: "",
      });
      setFiles([]);
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your enquiry. Please try again or email directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding hero-gradient relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container-legal relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <span className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-sm font-medium text-primary-foreground/90">
                Get in Touch
              </span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Need a Clear Legal Opinion{" "}
              <span className="text-gold">or Document?</span>
            </h2>

            <p className="text-lg text-primary-foreground/80 mb-8">
              Share your legal requirement, and I'll provide you with a tailored 
              solution. Upload relevant documents for faster assessment.
            </p>

            {/* Trust Indicators */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <span>All communications are strictly confidential</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <span>Response within 24 hours</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-accent" />
                </div>
                <span>Upload documents for review (PDF, DOC, Images)</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-8 shadow-elevated"
              aria-label="Contact Form"
            >
              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="absolute opacity-0 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name <span className="text-accent">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`h-12 ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email Address <span className="text-accent">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Requirement Type */}
                <div className="space-y-2">
                  <Label className="text-foreground">
                    Type of Requirement <span className="text-accent">*</span>
                  </Label>
                  <Select
                    value={formData.requirementType}
                    onValueChange={(value) => {
                      setFormData({ ...formData, requirementType: value });
                      if (errors.requirementType) setErrors({ ...errors, requirementType: "" });
                    }}
                  >
                    <SelectTrigger className={`h-12 ${errors.requirementType ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select requirement type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requirementTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.requirementType && (
                    <p className="text-sm text-destructive">{errors.requirementType}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Brief Description <span className="text-accent">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe your legal requirement..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors({ ...errors, description: "" });
                    }}
                    rows={4}
                    className={`resize-none ${errors.description ? 'border-destructive' : ''}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label className="text-foreground">
                    Upload Documents <span className="text-muted-foreground text-sm">(Optional, max 5 files)</span>
                  </Label>
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX, JPG, PNG, TXT (max 10MB each)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {files.map((file) => (
                        <div 
                          key={file.name}
                          className="flex items-center justify-between bg-muted rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">({file.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.name)}
                            className="p-1 hover:bg-background rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                  <Label className="text-foreground">Urgency</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, urgency: value })
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting || isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      Submit Enquiry
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
