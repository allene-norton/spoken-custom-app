'use client';

import ClipItem from '@/components/clip-item';
import { Button } from '@/components/ui/button';
import type { Clip, Clips } from '@/app/types';
import { useState, useEffect, useCallback, memo } from 'react';

interface ClipsSectionProps {
  selectedPlaylistId: string | null;
  selectedPlaylistTitle: string;
  onClipClick: (clip: Clip) => void;
}

const LoadingDots = memo(() => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
  </div>
));

LoadingDots.displayName = 'LoadingDots';

const ClipSkeleton = memo(() => (
  <div className="space-y-2">
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
        <div className="animate-pulse bg-muted rounded w-16 h-16" />
        <div className="flex-1 space-y-2">
          <div className="animate-pulse bg-muted rounded h-4 w-full" />
          <div className="animate-pulse bg-muted rounded h-3 w-3/4" />
          <div className="flex gap-2 mt-2">
            <div className="animate-pulse bg-muted rounded h-3 w-16" />
            <div className="animate-pulse bg-muted rounded h-3 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
));

ClipSkeleton.displayName = 'ClipSkeleton';

const ClipsSection = memo(({ 
  selectedPlaylistId, 
  selectedPlaylistTitle, 
  onClipClick 
}: ClipsSectionProps) => {
  const [clips, setClips] = useState<Clips>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedPlaylistIds, setLoadedPlaylistIds] = useState<Set<string>>(new Set());

  const fetchClips = useCallback(async (playlistId: string) => {
    if (!playlistId || loadedPlaylistIds.has(playlistId)) return;
    
    setLoading(true);
    setError(null);
    setClips([]); // Clear clips when switching playlists
    
    try {
      const response = await fetch(
        `/api/playlistClips?playlistId=${encodeURIComponent(playlistId)}`
      );

      if (!response.ok) {
        let errorMessage = `Failed to fetch clips: ${response.statusText}`;
        if (response.status === 500) {
          errorMessage = 'Server error occurred. This may be due to external API rate limits. Please try again in a moment.';
        } else if (response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please wait before trying again.';
        }
        throw new Error(errorMessage);
      }

      const clipsData = await response.json();
      setClips(clipsData);
      setLoadedPlaylistIds(prev => new Set([...prev, playlistId]));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch clips';
      console.error('Failed to fetch clips:', error);
      setError(errorMessage);
      setClips([]);
    } finally {
      setLoading(false);
    }
  }, [loadedPlaylistIds]);

  useEffect(() => {
    if (selectedPlaylistId) {
      fetchClips(selectedPlaylistId);
    }
  }, [selectedPlaylistId, fetchClips]);

  const retryFetchClips = useCallback(() => {
    if (selectedPlaylistId) {
      setLoadedPlaylistIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedPlaylistId);
        return newSet;
      });
      fetchClips(selectedPlaylistId);
    }
  }, [selectedPlaylistId, fetchClips]);

  const filteredClips = selectedPlaylistId 
    ? clips?.filter(clip => clip.PlaylistIds?.includes(selectedPlaylistId))
    : [];

  const renderContent = () => {
    if (loading) {
      return <ClipSkeleton />;
    }

    if (error) {
      return (
        <div className="text-center py-8 space-y-4">
          <p className="text-red-500 text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={retryFetchClips}
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
      );
    }

    if (!selectedPlaylistId) {
      return (
        <p className="text-muted-foreground text-center py-8">
          Select a playlist to view clips
        </p>
      );
    }

    if (filteredClips?.length === 0) {
      return (
        <p className="text-muted-foreground text-center py-8">
          No clips found for this playlist
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {filteredClips?.slice(0, 10).map(clip => (
          <ClipItem key={clip.Id} clip={clip} onClick={onClipClick} />
        ))}
      </div>
    );
  };

  return (
    <div className="lg:w-1/2 xl:flex-1">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground truncate">
          Latest {selectedPlaylistTitle} Clips
        </h2>
        {loading && <LoadingDots />}
      </div>
      {renderContent()}
    </div>
  );
});

ClipsSection.displayName = 'ClipsSection';

export default ClipsSection;