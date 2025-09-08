'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import PlaylistCard from '@/components/playlist-card';
// import ProgramAnalytics from "./program-analytics"
import ClipItem from './clip-item';
import type {
  Program,
  Playlists,
  Clips,
  Clip,
  Network,
  Playlist,
} from '@/app/types';
import { useState, useEffect } from 'react';

interface ProgramDetailProps {
  program: Program;
  network?: Network;
  onBack: () => void;
}

// Shimmer loading component
const Shimmer = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

// Loading skeleton for playlists
const PlaylistSkeleton = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, i) => (
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

// Loading skeleton for clips
const ClipSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
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

export default function ProgramDetail({
  program,
  network,
  onBack,
}: ProgramDetailProps) {
  const [loading, setLoading] = useState(false);
  const [clipsLoading, setClipsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlists>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<
    string | null | undefined
  >(null);
  const [clips, setClips] = useState<Clips>([]);
  const [selectedPlaylistTitle, setSelectedPlaylistTitle] = useState<
    string | null | undefined
  >('');

  const filteredClips = clips?.filter((clip) =>
    selectedPlaylistId ? clip.PlaylistIds.includes(selectedPlaylistId) : false,
  );

  const handlePlaylistClick = async (playlist: Playlist) => {
    setSelectedPlaylistId(playlist.Id);
    setSelectedPlaylistTitle(playlist.Title);
    setClipsLoading(true);

    if (playlist.Id) {
      try {
        const response = await fetch(
          `/api/playlists?playlistId=${encodeURIComponent(playlist.Id)}`,
        );
        const clips = await response.json();
        setClips(clips);
      } catch (error) {
        console.error('Failed to fetch clips:', error);
      } finally {
        setClipsLoading(false);
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    if (!network) {
      setError('Network not found');
      setLoading(false);
      return;
    }

    try {
      if (!program) {
        throw new Error('Program not found');
      }
      const params = new URLSearchParams({
        programId: program.Id,
      });

      const response = await fetch(`/api/programs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const result: Playlists = await response.json();
      setPlaylists(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (program) {
      fetchData();
    }
  }, [program]);

  useEffect(() => {
    if (playlists && playlists.length > 0) {
      const firstPlaylistId = playlists[0].Id;
      const firstPlaylistTitle = playlists[0].Title;
      setSelectedPlaylistId(firstPlaylistId);
      setSelectedPlaylistTitle(firstPlaylistTitle);

      if (!firstPlaylistId) {
        console.error('Playlist ID is missing');
        return;
      }

      const fetchClips = async () => {
        setClipsLoading(true);
        try {
          const response = await fetch(
            `/api/playlists?playlistId=${encodeURIComponent(firstPlaylistId)}`,
          );
          const clips = await response.json();
          setClips(clips);
        } catch (error) {
          console.error('Failed to fetch clips:', error);
        } finally {
          setClipsLoading(false);
        }
      };

      fetchClips();
    }
  }, [playlists]);

  return (
    <div className="h-screen bg-background p-6 flex flex-col">
      <div className="max-w-7xl mx-auto flex-1 flex flex-col">
        {/* Header */}
        <header className="mb-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            {program.Name}
          </h1>
        </header>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
          {/* Left Column: Program Details */}
          <div className="flex flex-col gap-6 min-w-0">
            {/* Program Artwork */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 flex-shrink-0">
                <img
                  src={
                    program.Urls.ImagePublicUrl ||
                    `/placeholder.svg?height=192&width=192&query=${encodeURIComponent(program.Name + ' podcast cover') || '/placeholder.svg'}`
                  }
                  alt={`${program.Name} cover`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="text-muted-foreground text-center w-full text-sm">
                {program.Description || 'No description available'}
              </p>
            </div>

            {/* Playlists Section */}
            <Card className="flex-1 min-h-0 flex flex-col">
              <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  Playlists{' '}
                  {loading && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                {error && (
                  <p className="text-red-500 text-sm mb-2">Error: {error}</p>
                )}
                {loading ? (
                  <PlaylistSkeleton />
                ) : (
                  <>
                    {playlists?.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No playlists found
                      </p>
                    ) : (
                      <div className="space-y-2 h-full overflow-y-auto">
                        {playlists?.map((playlist, index) => {
                          return (
                            <PlaylistCard
                              key={playlist?.Id || index}
                              playlist={playlist}
                              program={program}
                              network={network}
                              onClick={handlePlaylistClick}
                            />
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Program Analytics */}
            {/* <ProgramAnalytics network={network} programId={program.id} /> */}
          </div>

          {/* Right Column: Latest Clips */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <h2 className="text-2xl font-semibold text-foreground">
                Latest {selectedPlaylistTitle} Clips
              </h2>
              {clipsLoading && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {clipsLoading ? (
                <ClipSkeleton />
              ) : (
                <div className="space-y-2">
                  {filteredClips?.slice(0, 10).map((clip) => (
                    <ClipItem key={clip.Id} clip={clip} />
                  ))}
                  {!clipsLoading && filteredClips?.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No clips found for this playlist
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
