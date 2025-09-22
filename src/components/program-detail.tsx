'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PlaylistCard from '@/components/playlist-card';
import ClipItem from './clip-item';
import ClipDetail from '@/components/clip-detail';
import ProgramAnalytics from '@/components/programAnalytics';
import type {
  Program,
  Playlists,
  Clips,
  Network,
  Playlist,
  Clip,
} from '@/app/types';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface ProgramDetailProps {
  program: Program;
  network?: Network;
  onBack: () => void;
}

// Loading Components
const LoadingDots = () => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
  </div>
);

const Shimmer = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

const PlaylistSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
        <Shimmer className="w-12 h-12 rounded" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const ClipSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
        <Shimmer className="w-16 h-16 rounded" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-3 w-3/4" />
          <div className="flex gap-2 mt-2">
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-3 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Custom hook for playlists data
const usePlaylists = (program: Program, network?: Network) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlists>([]);

  const fetchPlaylists = useCallback(async () => {
    if (!program?.Id || !network) {
      setError(!network ? 'Network not found' : 'Program not found');
      return;
    }
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
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch playlists';
      setError(errorMessage);
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  }, [program?.Id, network]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading, error, refetch: fetchPlaylists };
};

// Custom hook for clips data
const useClips = () => {
  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState<Clips>([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(
    null,
  );
  const [loadedPlaylistIds, setLoadedPlaylistIds] = useState<Set<string>>(
    new Set(),
  );
  const [error, setError] = useState<string | null>(null);

  const fetchClips = useCallback(
    async (playlistId: string) => {
      if (!playlistId) return;

      // Clear clips and error immediately when switching playlists
      if (currentPlaylistId !== playlistId) {
        setClips([]);
        setError(null);
      }

      setCurrentPlaylistId(playlistId);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/playlistClips?playlistId=${encodeURIComponent(playlistId)}`,
        );

        if (!response.ok) {
          // Handle different error types
          let errorMessage = `Failed to fetch clips: ${response.statusText}`;
          if (response.status === 500) {
            errorMessage =
              'Server error occurred. This may be due to external API rate limits. Please try again in a moment.';
          } else if (response.status === 429) {
            errorMessage =
              'Rate limit exceeded. Please wait before trying again.';
          }
          throw new Error(errorMessage);
        }

        const clipsData = await response.json();
        setClips(clipsData);
        setLoadedPlaylistIds((prev) => new Set([...prev, playlistId]));
        setError(null); // Clear any previous errors on success
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch clips';
        console.error('Failed to fetch clips:', error);
        setError(errorMessage);
        setClips([]);
        // Don't add to loadedPlaylistIds on error so retry is possible
      } finally {
        setLoading(false);
      }
    },
    [currentPlaylistId],
  );

  // Check if current playlist has been loaded successfully
  const hasLoadedCurrentPlaylist = currentPlaylistId
    ? loadedPlaylistIds.has(currentPlaylistId)
    : false;

  const retryFetchClips = useCallback(() => {
    if (currentPlaylistId) {
      // Remove from loaded set to allow retry
      setLoadedPlaylistIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentPlaylistId);
        return newSet;
      });
      fetchClips(currentPlaylistId);
    }
  }, [currentPlaylistId, fetchClips]);

  return {
    clips,
    loading,
    error,
    fetchClips,
    currentPlaylistId,
    hasLoadedCurrentPlaylist,
    retryFetchClips,
    refetchClips: () => currentPlaylistId && fetchClips(currentPlaylistId),
  };
};

// Program artwork component
const ProgramArtwork = ({
  program,
  size = 'large',
}: {
  program: Program;
  size?: 'small' | 'large';
}) => {
  const sizeClasses = {
    small: 'w-20 h-20 sm:w-24 sm:h-24',
    large: 'w-48 h-48',
  };

  const fallbackUrl = `/placeholder.svg?height=${size === 'large' ? '192' : '96'}&width=${size === 'large' ? '192' : '96'}&query=${encodeURIComponent(program.Name + ' podcast cover')}`;

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0`}>
      <img
        src={program.Urls.ImagePublicUrl || fallbackUrl}
        alt={`${program.Name} cover`}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
    </div>
  );
};

// Main component
export default function ProgramDetail({
  program,
  network,
  onBack,
}: ProgramDetailProps) {
  const {
    playlists,
    loading: playlistsLoading,
    error,
    refetch: refetchPlaylists,
  } = usePlaylists(program, network);

  const {
    clips,
    loading: clipsLoading,
    error: clipsError,
    fetchClips,
    hasLoadedCurrentPlaylist,
    retryFetchClips,
  } = useClips();

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );
  const [selectedPlaylistTitle, setSelectedPlaylistTitle] =
    useState<string>('');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const memoizedProgram = useMemo(() => program, [program.Id, program.Name]);

  // Refresh function to refetch all data
  const refreshProgramData = useCallback(async () => {
    console.log('Refreshing program data...');

    // Refetch playlists
    await refetchPlaylists();

    // Refetch clips for the currently selected playlist
    if (selectedPlaylistId) {
      await fetchClips(selectedPlaylistId);
    }
  }, [refetchPlaylists, fetchClips, selectedPlaylistId]);

  // ------------------ PLAYLISTS HANDLING ------------------------------------------------

  // Auto-select first playlist when playlists are loaded
  useEffect(() => {
    if (playlists && playlists.length > 0 && !selectedPlaylistId) {
      const firstPlaylist = playlists[0];
      if (firstPlaylist?.Id) {
        setSelectedPlaylistId(firstPlaylist.Id);
        setSelectedPlaylistTitle(firstPlaylist.Title || '');
        fetchClips(firstPlaylist.Id);
      }
    }
  }, [playlists, selectedPlaylistId, fetchClips]);

  // Click to select playlist
  const handlePlaylistClick = useCallback(
    async (playlist: Playlist) => {
      if (!playlist?.Id) return;

      setSelectedPlaylistId(playlist.Id);
      setSelectedPlaylistTitle(playlist.Title || '');
      fetchClips(playlist.Id);
    },
    [fetchClips],
  );

  // Filtered clips based on selected playlist
  const filteredClips = useMemo(() => {
    if (!selectedPlaylistId) return [];
    return (
      clips?.filter((clip) => clip.PlaylistIds?.includes(selectedPlaylistId)) ||
      []
    );
  }, [clips, selectedPlaylistId]);

  // Render playlists content
  const renderPlaylistsContent = () => {
    if (error) {
      return <p className="text-red-500 text-sm mb-2">Error: {error}</p>;
    }

    if (playlistsLoading) {
      return <PlaylistSkeleton />;
    }

    if (playlists?.length === 0) {
      return (
        <p className="text-muted-foreground text-sm">No playlists found</p>
      );
    }

    return (
      <>
        {playlists?.map((playlist, index) => (
          <PlaylistCard
            key={playlist?.Id || `playlist-${index}`}
            playlist={playlist}
            program={program}
            network={network}
            onClick={handlePlaylistClick}
          />
        ))}
      </>
    );
  };

  // ------------------ CLIPS HANDLING ------------------------------------------------

  // Add clip click handler
  const handleClipClick = useCallback((clip: Clip) => {
    setSelectedClip(clip);
  }, []);

  // Add clip back handler
  const handleClipBackClick = useCallback(() => {
    setSelectedClip(null);
  }, []);

  // Add clip updated handler
  const handleClipUpdated = useCallback(() => {
    refreshProgramData();
  }, [refreshProgramData]);

  // Render clips content
  const renderClipsContent = () => {
    // Show loading if clips are loading OR if we have a playlist selected but haven't loaded it yet
    const shouldShowLoading =
      clipsLoading ||
      (selectedPlaylistId && !hasLoadedCurrentPlaylist && !clipsError);

    if (shouldShowLoading) {
      return <ClipSkeleton />;
    }

    // Show error state with retry option
    if (clipsError) {
      return (
        <div className="text-center py-8 space-y-4">
          <p className="text-red-500 text-sm">{clipsError}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={retryFetchClips}
            disabled={clipsLoading}
          >
            {clipsLoading ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
      );
    }

    // Show message when no playlist is selected
    if (!selectedPlaylistId) {
      return (
        <p className="text-muted-foreground text-center py-8">
          Select a playlist to view clips
        </p>
      );
    }

    // Show message when no clips found for selected playlist
    if (!filteredClips || filteredClips.length === 0) {
      return (
        <p className="text-muted-foreground text-center py-8">
          No clips found for this playlist
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {filteredClips.slice(0, 10).map((clip) => (
          <ClipItem key={clip.Id} clip={clip} onClick={handleClipClick} />
        ))}
      </div>
    );
  };

  // Add conditional rendering for ClipDetail with refresh callback
  if (selectedClip) {
    return (
      <ClipDetail
        clip={selectedClip}
        onBack={handleClipBackClick}
        onClipUpdated={handleClipUpdated}
      />
    );
  }

  // Description handling
  // --- Description Handling ------
  const shouldTruncate =
    program.Description && program.Description.length > 200;
  const truncatedDescription = shouldTruncate
    ? program.Description.substring(0, 200) + '...'
    : program.Description;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-balance line-clamp-2 min-w-0">
              {program.Name}
            </h1>
          </div>
        </header>

        {/* Program Info - Desktop only */}
        <div className="hidden lg:flex flex-col items-center gap-6 pb-6 w-full">
          <ProgramArtwork program={program} size="large" />

          {/* Description */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Program Description
            </h3>
            {showFullDescription ? (
              <div
                className="text-muted-foreground prose prose-gray dark:prose-invert prose-sm mx-auto prose-p:text-sm prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline text-center"
                dangerouslySetInnerHTML={{
                  __html: program.DescriptionHtml || 'No description available',
                }}
              />
            ) : (
              <p className="text-muted-foreground text-sm leading-relaxed text-center">
                {truncatedDescription || 'No description available'}
              </p>
            )}
            {shouldTruncate && (
              <div className="flex justify-center mt-4">
        <Button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="bg-primary text-white text-sm hover:bg-primary/90 px-3 py-1 rounded"
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </Button>
      </div>
            )}
          </div>
        </div>

        {/* Mobile Program Info */}
        <div className="lg:hidden space-y-4 w-full">
          {/* Program artwork and basic info */}
          <div className="flex items-start gap-4 p-4">
            <ProgramArtwork program={program} size="small" />
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg mb-1 line-clamp-2">
                {program.Name}
              </h2>
              <p className="text-sm text-muted-foreground">Program Details</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4">
            <h3 className="font-semibold mb-3">About</h3>
            {showFullDescription ? (
              <div
                className="text-sm text-muted-foreground prose prose-gray dark:prose-invert prose-sm max-w-none prose-p:text-sm prose-p:leading-relaxed prose-p:mb-2 prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{
                  __html: program.DescriptionHtml || 'No description available',
                }}
              />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {truncatedDescription || 'No description available'}
              </p>
            )}
            {shouldTruncate && (
              <div className="flex justify-center mt-4">
        <Button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="bg-primary text-white text-sm hover:bg-primary/90 px-3 py-1 rounded"
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </Button>
      </div>
            )}
          </div>
        </div>

        {memoizedProgram && <ProgramAnalytics program={memoizedProgram} />}

        {/* Main Content - Responsive Layout with natural height */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Left Column: Playlists */}
          <div className="lg:w-1/2 xl:w-[480px] 2xl:w-[520px]">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl lg:text-2xl font-semibold text-foreground">
                Playlists
              </h2>
              {playlistsLoading && <LoadingDots />}
            </div>

            <div className="space-y-2">{renderPlaylistsContent()}</div>
          </div>
          {/* Right Column: Clips */}
          <div className="lg:w-1/2 xl:flex-1">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl lg:text-2xl font-semibold text-foreground truncate">
                Latest {selectedPlaylistTitle} Clips
              </h2>
              {clipsLoading && <LoadingDots />}
            </div>

            <div>{renderClipsContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
