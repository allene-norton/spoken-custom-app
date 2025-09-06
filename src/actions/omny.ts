import { Network, Clips, Clip, Download } from '@/app/types';

export const omnyKey = process.env.OMNY_API_KEY;

export const OMNY_BASE_URI = 'https://api.omnystudio.com/v1';

export const options = {
  headers: {
    Authorization: `Bearer ${process.env.OMNY_API_KEY}`,
  },
};

export async function getNetworkByName(companyName: string | undefined) {
  const response = await fetch(`${OMNY_BASE_URI}/networks`, options);
  const networks = await response.json();
  const network: Network | undefined = networks?.Items.find(
    (network: Network) => network.Name === companyName,
  );

  return network;
}

export async function getProgramsByNetwork(networkId?: string | undefined) {
  const response = await fetch(
    `${OMNY_BASE_URI}/networks/${networkId}/programs`,
    options,
  );
  const programs = await response.json();
  return programs.Items;
}

export async function getPlaylistsByNetwork(networkId?: string | undefined) {
  const response = await fetch(
    `${OMNY_BASE_URI}/networks/${networkId}/playlists`,
    options,
  );
  const playlists = await response.json();
  return playlists.Items;
}

export async function getClipsByPlaylist(playlistId?: string | undefined) {
  const response = await fetch(
    `${OMNY_BASE_URI}/playlists/${playlistId}/clips`,
    options,
  );
  const clips = await response.json();
  const recentClips = clips.Items.slice(0, 10).map(
    (item: { Clip: Clip }) => item.Clip,
  );
  return recentClips;
}

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