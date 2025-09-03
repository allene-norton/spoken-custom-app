'use client';

import { useBreadcrumbs } from '@/bridge/header';
import { Body, Heading, Icon } from 'copilot-design-system';
import { Company, Programs, Playlists, Clips } from '@/app/types';

/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;


export async function Welcome({
  portalUrl,
  company,
  programs,
  playlists
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
      <header className="max-w-prose">
        <div className="w-8 mb-4">
          <Icon icon="Code" />
        </div>
        <div className="mb-2">
          <Heading variant="3xl">
            Welcome to the custom app {company?.name}
          </Heading>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-8 mt-12 max-w-prose">

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
          <a href="/internal" className="group" rel="noopener noreferrer">
            <Heading variant="2xl">Internal</Heading>
          </a>
          <p className={`m-0 mt-1 max-w-[30ch] text-sm opacity-50`}>
            Internal link
          </p>
        </div>
      </div>
    </>
  );
}

