'use client';

import PlaylistCard from '@/components/playlist-card';
import type { Program, Network, Playlist, Playlists } from '@/app/types';
import { useState, useEffect, useCallback, memo } from 'react';

interface PlaylistsSectionProps {
  program: Program;
  network?: Network;
  onPlaylistSelect: (playlistId: string, title: string) => void;
}

const LoadingDots = memo(() => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
  </div>
));

LoadingDots.displayName = 'LoadingDots';

const PlaylistSkeleton = memo(() => (
  <div className="space-y-2">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
        <div className="animate-pulse bg-muted rounded w-12 h-12" />
        <div className="flex-1 space-y-2">
          <div className="animate-pulse bg-muted rounded h-4 w-3/4" />
          <div className="animate-pulse bg-muted rounded h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
));

PlaylistSkeleton.displayName = 'PlaylistSkeleton';

const PlaylistsSection = memo(({ 
  program, 
  network, 
  onPlaylistSelect 
}: PlaylistsSectionProps) => {
  const [playlists, setPlaylists] = useState<Playlists>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    if (!program?.Id || !network || hasFetched) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({ programId: program.Id });
      const response = await fetch(`/api/programPlaylists?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch playlists: ${response.statusText}`);
      }
      
      const result: Playlists = await response.json();
      setPlaylists(result);
      setHasFetched(true);
      
      // Auto-select first playlist
      if (result && result.length > 0 && result[0]?.Id) {
        onPlaylistSelect(result[0].Id, result[0].Title || '');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch playlists';
      setError(errorMessage);
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  }, [program?.Id, network, hasFetched, onPlaylistSelect]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handlePlaylistClick = useCallback((playlist: Playlist) => {
    if (!playlist?.Id) return;
    onPlaylistSelect(playlist.Id, playlist.Title || '');
  }, [onPlaylistSelect]);

  const renderContent = () => {
    if (error) {
      return <p className="text-red-500 text-sm mb-2">Error: {error}</p>;
    }

    if (loading) {
      return <PlaylistSkeleton />;
    }

    if (playlists && playlists.length === 0) {
      return <p className="text-muted-foreground text-sm">No playlists found</p>;
    }

    return playlists?.map((playlist, index) => (
      <PlaylistCard
        key={playlist?.Id || `playlist-${index}`}
        playlist={playlist}
        program={program}
        network={network}
        onClick={handlePlaylistClick}
      />
    ));
  };

  return (
    <div className="lg:w-1/2 xl:w-[480px] 2xl:w-[520px]">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground">
          Playlists
        </h2>
        {loading && <LoadingDots />}
      </div>
      <div className="space-y-2">
        {renderContent()}
      </div>
    </div>
  );
});

PlaylistsSection.displayName = 'PlaylistsSection';

export default PlaylistsSection;