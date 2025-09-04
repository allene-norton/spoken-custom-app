import React, { useState, useEffect } from 'react';
import { Clock, Check, Edit3, CalendarOff } from 'lucide-react';
import { Card} from '@/components/ui/card';
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
      return <CalendarOff className="w-4 h-4" />;
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
  const [imageSrc, setImageSrc] = useState('/placeholder.svg');

  useEffect(() => {
    const validateImage = () => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(clip.Urls.ImagePublicUrl);
      };
      img.onerror = () => {
        setImageSrc('/placeholder.svg');
      };
      img.src = clip.Urls.ImagePublicUrl;
    };

    if (clip.Urls.ImagePublicUrl) {
      validateImage();
    }
  }, [clip.Urls.ImagePublicUrl]);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 px-2 py-0.5">
        {/* Thumbnail */}
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={imageSrc}
            alt={`${clip.Title} thumbnail`}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-0.5">
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${getStatusColor(
                clip.PublishState as PublishState,
              )}`}
            >
              <StatusIcon status={clip.PublishState as PublishState} />
              <span className="capitalize">{clip.PublishState}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-medium text-card-foreground text-pretty flex-1">
              {clip.Title}
            </h3>

            <p className="text-sm text-muted-foreground ml-3 flex-shrink-0">
              {new Date(clip.PublishedUtc).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
