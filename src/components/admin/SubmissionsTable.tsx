import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge, { SubmissionStatus } from './StatusBadge';
import SubmissionDetail from './SubmissionDetail';
import { Search, RefreshCw, Eye, FileText, Loader2, Inbox } from 'lucide-react';

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
  created_at: string; // Storing as ISO string
  updated_at: string; // Storing as ISO string
}

// Raw data structure from Firestore
interface FirestoreSubmission {
  id: string;
  name: string;
  email: string;
  requirement_type: string;
  description: string;
  urgency: string;
  status: SubmissionStatus;
  notes: string | null;
  document_urls: string[] | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

const SubmissionsTable = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const submissionsRef = collection(db, 'contact_submissions');
      let q = query(submissionsRef, orderBy('created_at', 'desc'));

      if (statusFilter !== 'all') {
        q = query(q, where('status', '==', statusFilter));
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data() as Omit<FirestoreSubmission, 'id'>;
        return {
          id: doc.id,
          ...docData,
          // Convert Firestore Timestamps to ISO strings for reliable date handling
          created_at: docData.created_at.toDate().toISOString(),
          updated_at: docData.updated_at.toDate().toISOString(),
        };
      });

      // Map database status values to our SubmissionStatus type
      const mappedData = data.map(item => ({
        ...item,
        status: mapDatabaseStatus(item.status),
      }));

      setSubmissions(mappedData);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Map database status strings to our enum
  const mapDatabaseStatus = (dbStatus: string | null): SubmissionStatus => {
    const statusMap: Record<string, SubmissionStatus> = {
      'new': 'new',
      'in_review': 'in_review',
      'in review': 'in_review',
      'awaiting_client': 'awaiting_client',
      'awaiting client': 'awaiting_client',
      'awaiting client response': 'awaiting_client',
      'responded': 'responded',
      'closed': 'closed',
    };
    return statusMap[dbStatus?.toLowerCase() || 'new'] || 'new';
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const filteredSubmissions = submissions.filter((submission) => {
    if (!searchQuery) return true;
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      submission.name.toLowerCase().includes(lowercasedQuery) ||
      submission.email.toLowerCase().includes(lowercasedQuery) ||
      submission.requirement_type.toLowerCase().includes(lowercasedQuery)
    );
  });

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsDetailOpen(true);
  };

  const statusTabs: { value: SubmissionStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'in_review', label: 'In Review' },
    { value: 'awaiting_client', label: 'Awaiting' },
    { value: 'responded', label: 'Responded' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as SubmissionStatus | 'all')}>
          <TabsList className="flex-wrap h-auto">
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchSubmissions} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No submissions found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try adjusting your search query' : 'Submissions will appear here when clients submit enquiries'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Service</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Docs</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow 
                    key={submission.id} 
                    className="hover:bg-muted/30 cursor-pointer"
                    onClick={() => handleViewDetails(submission)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{submission.name}</p>
                        <p className="text-sm text-muted-foreground">{submission.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{submission.requirement_type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(submission.created_at), 'MMM d, yyyy')}
                      <br />
                      <span className="text-xs">{format(new Date(submission.created_at), 'h:mm a')}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={submission.status} />
                    </TableCell>
                    <TableCell>
                      {submission.document_urls && submission.document_urls.length > 0 ? (
                        <div className="flex items-center gap-1 text-primary">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{submission.document_urls.length}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(submission);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <SubmissionDetail
        submission={selectedSubmission}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSubmission(null);
        }}
        onUpdate={fetchSubmissions}
      />
    </div>
  );
};

export default SubmissionsTable;
