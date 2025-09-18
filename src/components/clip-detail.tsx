'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import type { Clip, PublishState, Visibility } from '@/app/types';
import parse from 'html-react-parser';
import { RichTextEditor } from '@/components/richtexteditor';

interface ClipDetailProps {
  clip: Clip;
  onBack: () => void;
}

export default function ClipDetail({ clip, onBack }: ClipDetailProps) {
  const [title, setTitle] = useState(clip.Title);
  const [descriptionHtml, setDescriptionHtml] = useState(
    clip.DescriptionHtml || '',
  );
  const [isSaving, setIsSaving] = useState(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  const getVisibilityColor = (visibility: Visibility) => {
    switch (visibility) {
      case 'Public':
        return 'bg-[var(--status-published)] text-white';
      case 'Private':
        return 'bg-[var(--status-scheduled)] text-white';
      case 'Unlisted':
        return 'bg-[var(--status-draft)] text-white';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/postDescription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clipId: clip.Id,
          title: title,
          descriptionHtml: descriptionHtml,
        }),
      });

      if (response.ok) {
        // Handle success
        const data = await response.json()
        // console.log(`UPDATED CLIP:`, data)
        setDescriptionHtml(data.DescriptionHtml)
        clip.DescriptionHtml = data.DescriptionHtml;
        console.log('Clip updated successfully');
      }
    } catch (error) {
      console.error('Error updating clip:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-background p-6 flex flex-col">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Clip Details
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </header>

        {/* Clip Overview Card */}
        <div className="mb-6 bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between gap-6 mb-4">
            <h2 className="text-2xl font-semibold text-card-foreground flex-1">
              {clip.Title}
            </h2>
            <div className="text-md flex-1 text-center">
              <div className="text-left inline-block">
                <span className="font-semibold text-card-foreground">
                  Season:
                </span>{' '}
                {clip.Season || 'N/A'}
                <div>
                  <span className="font-semibold text-card-foreground">
                    Episode:
                  </span>{' '}
                  {clip.Episode || 'N/A'}
                </div>
              </div>
            </div>
            {clip.Urls?.ImagePublicUrl && (
              <div className="w-1/12 flex-shrink-0">
                <img
                  src={clip.Urls.ImagePublicUrl}
                  alt={clip.Title}
                  className="w-full h-auto rounded-md object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <div className="mt-1">
                <Badge
                  className={getStatusColor(clip.PublishState as PublishState)}
                >
                  {clip.PublishState}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Visibility
              </Label>
              <div className="mt-1">
                <Badge
                  className={getVisibilityColor(clip.Visibility as Visibility)}
                >
                  {clip.Visibility}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Episode Type
              </Label>
              <p className="mt-1 text-sm">{clip.EpisodeType || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Duration
              </Label>
              <p className="mt-1 text-sm font-mono">
                {formatDuration(clip.DurationSeconds)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Published Date
              </Label>
              <p className="mt-1 text-sm">{formatDate(clip.PublishedUtc)}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0 overflow-hidden mb-8">
          {/* Left Column: Clip Info & Editing */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 min-h-0 overflow-hidden">
            {/* Editable Fields */}
            <div className="flex flex-col flex-1 min-h-0 gap-4 overflow-hidden">
              <h2 className="text-xl font-semibold flex-shrink-0">Edit Clip</h2>
              <div className="flex-shrink-0">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <Label htmlFor="description" className="flex-shrink-0">
                  Description
                </Label>
                <div className="mt-1 relative flex-1 min-h-0">
                  <RichTextEditor
                    value={descriptionHtml}
                    onChange={setDescriptionHtml}
                    immediatelyRender={false}
                    placeholder="Enter a description for your clip..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clip Details */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 min-h-0 overflow-y-auto">
            {/* Description Display */}
            {clip.DescriptionHtml && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none prose-a:text-slate-600 prose-a:hover:text-slate-800">
                    {parse(clip.DescriptionHtml)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

