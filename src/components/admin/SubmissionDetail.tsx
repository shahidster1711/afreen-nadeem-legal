import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { functionsService } from '@/services/functions.service';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import StatusBadge, { SubmissionStatus } from './StatusBadge';
import { User, FileText, Clock, Calendar, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';

interface Submission {
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

interface SubmissionDetailProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const statusOptions: { value: SubmissionStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'awaiting_client', label: 'Awaiting Client Response' },
  { value: 'responded', label: 'Responded' },
  { value: 'closed', label: 'Closed' },
];

const SubmissionDetail = ({ submission, isOpen, onClose, onUpdate }: SubmissionDetailProps) => {
  const [newStatus, setNewStatus] = useState<SubmissionStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (submission) {
      setNotes(submission.notes || '');
    }
  }, [submission]);

  const handleStatusUpdate = async () => {
    if (!submission || !newStatus) return;
    
    setIsUpdating(true);
    const previousStatus = submission.status;
    
    try {
      // Update in database
      const submissionRef = doc(db, 'contact_submissions', submission.id);
      await updateDoc(submissionRef, { 
        status: newStatus,
        notes: notes ?? null,
        updated_at: new Date(),
      });
      
      // Send status update email using Firebase Cloud Functions
      try {
        await functionsService.call('sendStatusUpdateEmail', {
          submissionId: submission.id,
          clientName: submission.name,
          clientEmail: submission.email,
          newStatus: newStatus,
          previousStatus: previousStatus,
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the update if email fails
      }
      
      toast({
        title: 'Status Updated',
        description: `Submission status changed to "${statusOptions.find(s => s.value === newStatus)?.label}". Email notification sent to client.`,
      });
      
      setNewStatus('');
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update submission status. Please try again.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotesUpdate = async () => {
    if (!submission) return;
    
    setIsUpdating(true);
    
    try {
      const submissionRef = doc(db, 'contact_submissions', submission.id);
      await updateDoc(submissionRef, { 
        notes: notes ?? null,
        updated_at: new Date(),
      });
      
      toast({
        title: 'Notes Saved',
        description: 'Internal notes have been updated.',
      });
      
      onUpdate();
    } catch (err) {
      console.error('Error updating notes:', err);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save notes. Please try again.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Submission Details</SheetTitle>
          <SheetDescription>
            View and manage this enquiry
          </SheetDescription>
        </SheetHeader>
        
        {submission && (
          <div className="space-y-6">
            {/* Client Info */}
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{submission.name}</p>
                  <p className="text-sm text-muted-foreground">{submission.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Requested</p>
                  <p className="font-medium text-foreground">{submission.requirement_type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgency</p>
                  <p className="font-medium text-foreground capitalize">{submission.urgency}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(submission.created_at), 'PPpp')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <StatusBadge status={submission.status} />
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Message</Label>
              </div>
              <div className="p-4 rounded-lg bg-card border text-sm leading-relaxed">
                {submission.description}
              </div>
            </div>
            
            {/* Documents */}
            {submission.document_urls && submission.document_urls.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Attached Documents</Label>
                <div className="space-y-2">
                  {submission.document_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg bg-card border hover:bg-muted/50 transition-colors text-sm"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="flex-1 truncate">Document {index + 1}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Update Status */}
            <div className="space-y-3 p-4 rounded-lg border bg-card">
              <Label className="text-sm font-medium">Update Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as SubmissionStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status..." />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      disabled={option.value === submission.status}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={!newStatus || isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status & Notify Client'
                )}
              </Button>
            </div>
            
            {/* Internal Notes */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Internal Notes</Label>
              <Textarea
                placeholder="Add private notes about this submission..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <Button
                variant="outline"
                onClick={handleNotesUpdate}
                disabled={isUpdating || notes === (submission.notes || '')}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Notes'
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SubmissionDetail;
