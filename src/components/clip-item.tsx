import { Clock, Check, Edit3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Clip,
  Clips,
  ClipState,
  PublishState,
  EpisodeType,
  Visibility,
  ContentRating,
} from '@/app/types';

const StatusIcon = ({ status }: { status: PublishState }) => {
  switch (status) {
    case 'Published':
      return <Check className="w-4 h-4" />;
    case 'Scheduled':
      return <Clock className="w-4 h-4" />;
    case 'Draft':
      return <Edit3 className="w-4 h-4" />;
    case 'Unpublished':
      return <Edit3 className="w-4 h-4" />;
  }
};

const getStatusColor = (status: PublishState) => {
  switch (status) {
    case 'Published':
      return 'bg-[var(--status-published)] text-white';
    case 'Scheduled':
      return 'bg-[var(--status-scheduled)] text-white';
    case 'Draft':
      return 'bg-[var(--status-draft)] text-white';
  }
};

interface ClipItemProps {
  clip: Clip;
}
export default function ClipItem({ clip }: ClipItemProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        {/* Thumbnail */}
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={
              clip.Urls.ImagePublicUrl ||
              `/placeholder.svg?height=48&width=48&query=${
                encodeURIComponent(clip.Title + ' clip thumbnail') ||
                '/placeholder.svg'
              }`
            }
            alt={`${clip.Title} thumbnail`}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                clip.PublishState as PublishState,
              )}`}
            >
              <StatusIcon status={clip.PublishState as PublishState} />
              <span className="capitalize">{clip.PublishState}</span>
            </div>
          </div>

          <h3 className="font-medium text-card-foreground text-pretty mb-1">
            {clip.Title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {new Date(clip.PublishedUtc).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </Card>
  );
}
