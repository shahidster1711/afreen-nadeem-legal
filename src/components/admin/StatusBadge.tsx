import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type SubmissionStatus = 'new' | 'in_review' | 'awaiting_client' | 'responded' | 'closed';

interface StatusBadgeProps {
  status: SubmissionStatus;
}

const statusConfig: Record<SubmissionStatus, { label: string; className: string }> = {
  new: {
    label: 'New',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
  },
  in_review: {
    label: 'In Review',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  awaiting_client: {
    label: 'Awaiting Client',
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
  },
  responded: {
    label: 'Responded',
    className: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
  },
  closed: {
    label: 'Closed',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400',
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.new;
  
  return (
    <Badge variant="secondary" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
