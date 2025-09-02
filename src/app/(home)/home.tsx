import { copilotApi } from 'copilot-node-sdk';

import { Welcome } from '@/app/(home)/welcome';
import { TokenGate } from '@/components/TokenGate';
import { Container } from '@/components/Container';

/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const { token } = searchParams;
  const copilot = copilotApi({
    apiKey: process.env.COPILOT_API_KEY ?? '',
    token: typeof token === 'string' ? token : undefined,
  });
  const workspace = await copilot.retrieveWorkspace();
  const session = await copilot.getTokenPayload?.();
  const listClients = await copilot.listClients({limit:100})
  const listCompanies = await copilot.listCompanies({name: "Nearly Media"})
  console.log({ workspace, session });
  // console.log(listClients.data);
  console.log(listCompanies.data)
  const company = listCompanies.data?.[0]
  return (
    <Container>
      <Welcome portalUrl={workspace.portalUrl} company={company} />
    </Container>
  );
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <TokenGate searchParams={searchParams}>
      <Content searchParams={searchParams} />
    </TokenGate>
  );
}
