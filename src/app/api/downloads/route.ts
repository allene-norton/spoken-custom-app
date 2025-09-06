import { Download } from "@/app/types";
import { OMNY_BASE_URI, options } from "@/actions/omny";


export async function getNetworkDownloadsByTimeGrouping(
  networkId?: string | undefined,
  startDate?: string | undefined,
  endDate?: string | undefined,
  interval?: string | undefined,
) {
  const response = await fetch(
    `${OMNY_BASE_URI}/networks/${networkId}/analytics/downloads?${startDate}&${endDate}&${interval}`,
    options,
  );
  const downloads = await response.json()
  return downloads
}