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

export default function ProgramDetail({
  program,
  network,
  onBack,
}: ProgramDetailProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlists>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<
    string | null | undefined
  >(null);
  const [clips, setClips] = useState<Clips>([]);
  const [selectedPlaylistTitle, setSelectedPlaylistTitle] = useState<string | null | undefined>("")

  const filteredClips = clips?.filter((clip) =>
    selectedPlaylistId ? clip.PlaylistIds.includes(selectedPlaylistId) : false,
  );

  const handlePlaylistClick = async (playlist: Playlist) => {
    setSelectedPlaylistId(playlist.Id);
    setSelectedPlaylistTitle(playlist.Title)

    if (playlist.Id) {
      try {
        const response = await fetch(
          `/api/playlists?playlistId=${encodeURIComponent(playlist.Id)}`,
        );
        const clips = await response.json();
        setClips(clips);
      } catch (error) {
        console.error('Failed to fetch clips:', error);
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
        try {
          const response = await fetch(
            `/api/playlists?playlistId=${encodeURIComponent(firstPlaylistId)}`,
          );
          const clips = await response.json();
          setClips(clips);
        } catch (error) {
          console.error('Failed to fetch clips:', error);
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
        <div className="flex-1 flex gap-8 min-h-0">
          {/* Left Column: Program Details */}
          <div className="w-1/2 flex flex-col gap-6">
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
              <p className="text-muted-foreground text-center w-full">
                {program.Description || 'No description available'}
              </p>
            </div>

            {/* Playlists Section */}
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>Playlists {loading && '(Loading...)'}</CardTitle>
              </CardHeader>
              <CardContent className="min-w-0">
                {error && (
                  <p className="text-red-500 text-sm mb-2">Error: {error}</p>
                )}
                {loading ? (
                  <p className="text-muted-foreground">Loading playlists...</p>
                ) : (
                  <>
                    {playlists?.length === 0 ? (
                      <p className="text-muted-foreground">
                        No playlists found
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
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
          <div className="flex-1 flex flex-col min-w-0">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {selectedPlaylistTitle} Clips
            </h2>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {filteredClips?.slice(0, 10).map((clip) => (
                  <ClipItem key={clip.Id} clip={clip} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
