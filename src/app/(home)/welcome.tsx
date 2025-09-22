'use client';

import { useBreadcrumbs } from '@/bridge/header';
import { Body, Heading, Icon } from 'copilot-design-system';
import {
  Company,
  Programs,
  Playlists,
  Clips,
  Network,
  Program,
  Clip,
} from '@/app/types';
import ProgramCard from '@/components/program-card';
import ClipItem from '@/components/clip-item';
import Analytics from '@/components/analytics';
import { useState, useEffect } from 'react';
import ProgramDetail from '@/components/program-detail';
import ClipDetail from '@/components/clip-detail';

/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;

export function Welcome({
  portalUrl,
  company,
  programs,
  network,
}: {
  portalUrl?: string;
  company?: Company;
  programs?: Programs;
  network?: Network;
}) {
  useBreadcrumbs(
    [
      {
        label: 'Home',
      },
    ],
    { portalUrl },
  );

  //--------------------STATES-----------------------

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [recentClips, setRecentClips] = useState<Clips>();
  const [loading, setLoading] = useState(true);

  //---------LOADING COMPONENTS---------------
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

  //---------------- ON MOUNT----------------

  useEffect(() => {
    const fetchClips = async () => {
      if (!network?.Id) return;

      setLoading(true);
      try {
        // Fetch fresh playlists and clips
        const params = new URLSearchParams({ networkId: network.Id });
        const playlistsResponse = await fetch(
          `/api/networkPlaylists?${params}`,
        );
        const playlists = await playlistsResponse.json();

        if (playlists?.[0]?.Id) {
          const clipParams = new URLSearchParams({
            playlistId: playlists[0].Id,
          });
          const clipsResponse = await fetch(`/api/playlistClips?${clipParams}`);
          const clipsData = await clipsResponse.json();
          setRecentClips(clipsData);
        }
      } catch (error) {
        console.error('Error fetching clips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, [network?.Id]);

  //--------- CLICK HANDLERS---------------------

  const handleProgramClick = (program: Program) => {
    setSelectedProgram(program);
  };

  const handleClipClick = (clip: Clip) => {
    setSelectedClip(clip);
  };

  const handleBackClick = () => {
    setSelectedProgram(null);
  };

  const handleClipBackClick = () => {
    setSelectedClip(null);
  };

  //--------------- RENDER DETAILS PAGES ----------------------------------------------

  if (selectedClip) {
    return <ClipDetail clip={selectedClip} onBack={handleClipBackClick} />;
  }

  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        network={network}
        onBack={handleBackClick}
      />
    );
  }

  // ----------------- MAIN COMPONENT ----------------------

  return (
    <>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-4">
            <h1 className="text-3xl font-bold text-foreground text-balance">
              {company?.name}
            </h1>
          </header>

          {network && <Analytics network={network} />}

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Left Column: Programs */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Programs
              </h2>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {programs?.slice(0, 12).map((program) => (
                    <ProgramCard
                      key={program.Id}
                      program={program}
                      onClick={handleProgramClick}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Latest Episodes */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <h2 className="text-2xl font-semibold text-foreground">
                  Latest Episodes
                </h2>
                {loading && <LoadingDots />}
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <ClipSkeleton />
                ) : (
                  <div className="space-y-1">
                    {recentClips?.slice(0, 10).map((clip) => (
                      <ClipItem
                        key={clip.Id}
                        clip={clip}
                        onClick={handleClipClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
