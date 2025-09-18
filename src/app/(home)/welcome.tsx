'use client';

import { useBreadcrumbs } from '@/bridge/header';
import { Body, Heading, Icon } from 'copilot-design-system';
import { Company, Programs, Playlists, Clips, Network, Program, Clip } from '@/app/types';
import ProgramCard from '@/components/program-card';
import ClipItem from '@/components/clip-item';
import Analytics from '@/components/analytics';
import { useState, useEffect } from "react"
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

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null)
  const [recentClips, setRecentClips] = useState<Clips>()
  const [loading, setLoading] = useState(true)

//---------------- ON MOUNT----------------

useEffect(() => {
    const fetchClips = async () => {
      if (!network?.Id) return;
      
      setLoading(true);
      try {
        // Fetch fresh playlists and clips
        const params = new URLSearchParams({networkId: network.Id})
        const playlistsResponse = await fetch(`/api/networkPlaylists?${params}`);
        const playlists = await playlistsResponse.json();
        
        if (playlists?.[0]?.Id) {
          const clipParams = new URLSearchParams({playlistId: playlists[0].Id})
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
    setSelectedProgram(program)
  }

  const handleClipClick = (clip: Clip) => {
    setSelectedClip(clip)
  }

  const handleBackClick = () => {
    setSelectedProgram(null)
  }

  const handleClipBackClick = () => {
    setSelectedClip(null)
  }


//--------------- RENDER DETAILS PAGES ----------------------------------------------
  
  if (selectedClip) {
    return <ClipDetail clip={selectedClip} onBack={handleClipBackClick} />
  }

  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        network={network}
        onBack={handleBackClick}
      />
    )
  }

// ----------------- MAIN COMPONENT ----------------------

  return (
    <>
      <div className="h-screen bg-background p-6 flex flex-col overflow-hidden">
        <div className="max-w-7xl mx-auto flex-1 flex flex-col min-h-0">
          <header className="mb-4 flex-shrink-0">
            <h1 className="text-3xl font-bold text-foreground text-balance">
              {company?.name}
            </h1>
          </header>

          {network && <Analytics network={network} />}

          {/* Main Content */}
          <div className="flex-1 flex gap-8 min-h-0">
            {/* Left Column: Programs */}
            <div className="flex-1 flex flex-col min-h-0">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex-shrink-0">
                Programs
              </h2>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {programs?.slice(0, 12).map((program) => (
                    <ProgramCard key={program.Id} program={program} onClick={handleProgramClick}/>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Latest Episodes */}
            <div className="flex-1 flex flex-col min-h-0">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex-shrink-0">
                Latest Episodes
              </h2>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-1">
                  {recentClips?.slice(0, 10).map((clip) => (
                    <ClipItem key={clip.Id} clip={clip} onClick={handleClipClick} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
