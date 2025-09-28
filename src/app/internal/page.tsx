import Image from 'next/image';
import { TokenGate } from '@/components/TokenGate';
import { Container } from '@/components/Container';
import { getSession } from '@/utils/session';
import InternalPreviewNotice from '@/components/internal-preview-unavailable';


/**
 * The revalidate property determine's the cache TTL for this page and
 * all fetches that occur within it. This value is in seconds.
 */
export const revalidate = 180;



async function Content({ searchParams }: { searchParams: SearchParams }) {
  const data = await getSession(searchParams);
  console.log({ data });
  console.log(data.workspace.id)
  console.log(data.internalUser)
  return (

      <>
      <div className="w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center lg:static lg:w-auto">
          Internal Page&nbsp;
        </p>
        <p>Logged in user: {data.internalUser?.givenName} </p>
      </div>

      <div className="flex-col mb-32 text-center lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <h2 className={`mb-3 text-2xl font-semibold`}>
          This page is served to internal users.
        </h2>
      </div>
      <InternalPreviewNotice />
      </>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <TokenGate searchParams={searchParams}>
      <Content searchParams={searchParams}/>
    </TokenGate>
  );
}
