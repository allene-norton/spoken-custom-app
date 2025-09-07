'use client';

import { useBreadcrumbs } from '@/bridge/header';
import { Body, Heading, Icon } from 'copilot-design-system';
import { Company, Programs, Playlists, Clips, Network, Program } from '@/app/types';
import ProgramCard from '@/components/program-card';
import ClipItem from '@/components/clip-item';
import Analytics from '@/components/analytics';
import { useState } from "react"
import ProgramDetail from '@/components/program-detail';


/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;

export function Welcome({
  portalUrl,
  company,
  programs,
  playlists,
  recentClips,
  network,
  programClips
}: {
  portalUrl?: string;
  company?: Company;
  programs?: Programs;
  playlists?: Playlists;
  recentClips?: Clips;
  network?: Network;
  programClips?: Clips
}) {
  useBreadcrumbs(
    [
      {
        label: 'Home',
      },
    ],
    { portalUrl },
  );

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  const handleProgramClick = (program: Program) => {
    setSelectedProgram(program)
  }

  const handleBackClick = () => {
    setSelectedProgram(null)
  }

  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        playlists={playlists}
        programClips={programClips}
        network={network}
        onBack={handleBackClick}
      />
    )
  }

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
                    <ClipItem key={clip.Id} clip={clip} />
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
