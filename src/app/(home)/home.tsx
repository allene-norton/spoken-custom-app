import { copilotApi } from 'copilot-node-sdk';
import { getSession } from '@/utils/session';
import { Suspense } from 'react';


import { Welcome } from '@/app/(home)/welcome';
import { TokenGate } from '@/components/TokenGate';
import { Container } from '@/components/Container';
import { ComingSoon } from '@/components/coming-soon';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  getNetworkByName,
  getProgramsByNetwork,
  getPlaylistsByNetwork,
  getClipsByPlaylist,
  getNetworkDownloadsByTimeGrouping,
} from '@/actions/omny';

/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const { token } = searchParams;

  // Copilot API
  const copilot = copilotApi({
    apiKey: process.env.COPILOT_API_KEY ?? '',
    token: typeof token === 'string' ? token : undefined,
  });
  const workspace = await copilot.retrieveWorkspace();

  let session;
  try {
    session = await getSession(searchParams);
    console.log(`SESSION:`, session);
  } catch (error) {
    console.error('Session token error:', error);
    return <ComingSoon />;
  }

  // Retrieve company from Copilot/Assembly
  const retrieveCompany = session?.company || null;
  const listCompanies = await copilot.listCompanies({
    name: retrieveCompany?.name,
  });
  // console.log({ workspace, session });
  const company = listCompanies.data?.[0];

  if (!company || !session) {
    return <ComingSoon />;
  }

  // Omny API

  const network = await getNetworkByName(company?.name);
  if (!network){
    return <ComingSoon />;
  }
  // console.log(network)

  const programs = await getProgramsByNetwork(network?.Id);
  // console.log(programs)

  // const playlists = await getPlaylistsByNetwork(network?.Id);
  // console.log(playlists)

  // const recentPlaylists = playlists[0];
  // console.log(recentPlaylists)

  // const recentClips = await getClipsByPlaylist(recentPlaylists?.Id);
  // console.log(recentClips)

  return (
    // <Container>
    <>
      <Welcome
        portalUrl={workspace.portalUrl}
        company={company}
        programs={programs}
        // playlists={playlists}
        // recentClips={recentClips}
        network={network}
      />
      {/* </Container> */}
    </>
  );
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <TokenGate searchParams={searchParams}>
      <Suspense fallback={<LoadingSpinner />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </TokenGate>
  );
}
