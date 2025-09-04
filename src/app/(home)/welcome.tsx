'use client';

import { useBreadcrumbs } from '@/bridge/header';
import { Body, Heading, Icon } from 'copilot-design-system';
import { Company, Programs, Playlists, Clips } from '@/app/types';
import ProgramCard from '@/components/program-card';
import ClipItem from '@/components/clip-item';

/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;

export async function Welcome({
  portalUrl,
  company,
  programs,
  playlists,
  recentClips,
}: {
  portalUrl?: string;
  company?: Company;
  programs?: Programs;
  playlists?: Playlists;
  recentClips?: Clips;
}) {
  useBreadcrumbs(
    [
      {
        label: 'Home',
      },
    ],
    { portalUrl },
  );

  return (
    <>
      <div className="h-screen bg-background p-6 flex flex-col">
        <div className="max-w-7xl mx-auto flex-1 flex flex-col">
          <header className="mb-4">
            <h1 className="text-3xl font-bold text-foreground text-balance">
              {company?.name}
            </h1>
          </header>
          {/* Main Content */}
          <div className="flex-1 flex gap-8 min-h-0">
            {/* Left Column: Programs */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Programs
              </h2>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {programs?.slice(0, 12).map((program) => (
                    <ProgramCard key={program.Id} program={program} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Latest Episodes */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
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

/* 

 <div>
          <Heading variant="2xl">Program List</Heading>
          <ul>
            {programs?.map((program, index) => (
              <li key={program.Id}>{program.Name}</li>
            ))}
          </ul>
        </div>

        <div>
          <Heading variant="2xl">Playlists</Heading>
          <ul>
            {playlists?.map((playlist, index) => (
              <li key={playlist.Id}>{playlist.Title}</li>
            ))}
          </ul>
        </div>

         <div>
          <Heading variant="2xl">Recent Clips</Heading>
          <ul>
            {recentClips?.map((clip, index) => (
              <li key={clip.Id}>{clip.Title} {clip.ModifiedAtUtc}</li>
            ))}
          </ul>
        </div>

        <div>
          <a href="/internal" className="group" rel="noopener noreferrer">
            <Heading variant="2xl">Internal</Heading>
          </a>
          <p className={`m-0 mt-1 max-w-[30ch] text-sm opacity-50`}>
            Internal link
          </p>
        </div>


*/
