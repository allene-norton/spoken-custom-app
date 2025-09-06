import { copilotApi } from 'copilot-node-sdk';

import { Welcome } from '@/app/(home)/welcome';
import { TokenGate } from '@/components/TokenGate';
import { Container } from '@/components/Container';
import { getNetworkByName, getProgramsByNetwork, getPlaylistsByNetwork, getClipsByPlaylist, getNetworkDownloadsByTimeGrouping } from '@/actions/omny';

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
  const session = await copilot.getTokenPayload?.();
  const listCompanies = await copilot.listCompanies({name: "Nearly Media"})
  // console.log({ workspace, session });
  const company = listCompanies.data?.[0]

  // Omny API

  const network = await getNetworkByName(company?.name)
  // console.log(network)

  const programs = await getProgramsByNetwork(network?.Id)
  // console.log(programs)

  const playlists = await getPlaylistsByNetwork(network?.Id)
  // console.log(playlists)

  const recentPlaylists = playlists[0]
  // console.log(recentPlaylists)

  const recentClips = await getClipsByPlaylist(recentPlaylists?.Id)
  // console.log(recentClips)

  return (
    // <Container>
    <>
      <Welcome portalUrl={workspace.portalUrl} company={company} programs={programs} playlists={playlists} recentClips={recentClips} network={network} />
    {/* </Container> */}
    </>
  );
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <TokenGate searchParams={searchParams}>
      <Content searchParams={searchParams} />
    </TokenGate>
  );
}
