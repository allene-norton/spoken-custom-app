import React, { useState, useEffect } from 'react';
import {
  Clock,
  Check,
  Edit3,
  CalendarOff,
  RefreshCcwDot,
  CircleCheck,
  OctagonX,
  TriangleAlert,
  MegaphoneOff,
  CornerRightUp,
  CircleDashed,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Clip,
  PublishState,
  EpisodeType,
  Visibility,
  ContentRating,
  ClipProcessingState,
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
      return <CalendarOff className="w-4 h-4" />;
  }
};

const ProcessingIcon = ({
  processingState,
}: {
  processingState: ClipProcessingState;
}) => {
  switch (processingState) {
    case 'Ready':
      return <CircleCheck className="w-4 h-4" />;
    case 'Processing':
      return <RefreshCcwDot className="w-4 h-4" />;
    case 'Error':
      return <OctagonX className="w-4 h-4" />;
    case 'Warning':
      return <TriangleAlert className="w-4 h-4" />;
    case 'Draft':
      return <CircleDashed className="w-4 h-4" />;
    case 'AudioUploaded':
      return <CornerRightUp className="w-4 h-4" />;
    case 'None':
      return <MegaphoneOff className="w-4 h-4" />;
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

const getProcessingColor = (processingState: ClipProcessingState) => {
  switch (processingState) {
    case 'Ready':
      return '#107517';
    case 'Processing':
      return '#0093E8';
    case 'Error':
      return '#AD1B00';
    case 'Warning':
      return '#E8B900';
    case 'Draft':
      return '#545454';
    case 'AudioUploaded':
      return '#0093E8';
    case 'None':
      return '#545454';
  }
};

interface ClipItemProps {
  clip: Clip;
}

export default function ClipItem({ clip }: ClipItemProps) {
  const [imageSrc, setImageSrc] = useState('/placeholder.svg');
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const validateImage = () => {
      setImageLoading(true);
      const img = new Image();
      img.onload = () => {
        setImageSrc(clip.Urls.ImagePublicUrl);
        setImageLoading(false);
      };
      img.onerror = () => {
        setImageSrc('/placeholder.svg');
        setImageLoading(false);
      };
      img.src = clip.Urls.ImagePublicUrl;
    };

    if (clip.Urls.ImagePublicUrl) {
      validateImage();
    } else {
      setImageLoading(false);
    }
  }, [clip.Urls.ImagePublicUrl]);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3 px-2 py-0.5">
        {/* Thumbnail - responsive sizing */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 relative overflow-hidden rounded-md bg-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
          )}
          <img
            src={imageSrc}
            alt={`${clip.Title} thumbnail`}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* Content - improved responsive layout */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-0.5">
            <div
              className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                clip.PublishState as PublishState,
              )}`}
            >
              <StatusIcon status={clip.PublishState as PublishState} />
              <span className="capitalize hidden xs:inline sm:inline">
                {clip.PublishState}
              </span>
            </div>
          </div>

          {/* Stacked layout on mobile, side-by-side on larger screens */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <h3 className="font-medium text-card-foreground text-pretty flex-1 text-sm sm:text-base line-clamp-2">
              {clip.Title}
            </h3>

            <div className="flex items-center gap-2 sm:ml-3 flex-shrink-0">
              {/* Processing State Icon with HoverCard */}
              <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <div
                    className="flex items-center cursor-default"
                    style={{
                      color: getProcessingColor(
                        clip.State as ClipProcessingState,
                      ),
                    }}
                  >
                    <ProcessingIcon
                      processingState={clip.State as ClipProcessingState}
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-auto p-2">
                  <p className="text-sm font-medium">{clip.State}</p>
                </HoverCardContent>
              </HoverCard>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {clip.PublishState === 'Unpublished'
                  ? 'No date available'
                  : new Date(clip.PublishedUtc).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
