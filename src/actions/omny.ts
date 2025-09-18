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
    (network: Network) => network?.Name === companyName,
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
  networkId?: string | undefined | null,
  startDate?: string | undefined | null,
  endDate?: string | undefined | null,
  interval?: string | undefined | null,
  timezone?: string | undefined | null,
  // params?: string | undefined
) {
  const response = await fetch(
    `${OMNY_BASE_URI}/networks/${networkId}/analytics/downloads?startDate=${startDate}&endDate=${endDate}&interval=${interval}&timeZoneIanaId=${timezone}`,
    options,
  );
  const downloads = await response.json();
  return downloads;
}

// get playlists by program
// https://api.omnystudio.com/v1/programs/{programId}/playlists

export async function getPlaylistsByProgram(
  programId?: string | undefined | null,
) {
  const response = await fetch(
    `${OMNY_BASE_URI}/programs/${programId}/playlists`,
    options,
  );
  const playlists = await response.json();
  return playlists.Items;
}

// get analytics by program

// update clip

export async function updateClip(
  clipId?: string | undefined | null,
  title?: string | undefined | null,
  descriptionHtml?: string | undefined | null,
) {
  // DEBUG
  console.log(`Action: Clip ID is ${clipId}`);
  // console.log(`Action: Clip title is ${title}`);
  // console.log(`Action: Clip HTML is ${descriptionHtml}`);

  // create request body
  const updateData: any = {};
  if (title !== undefined) updateData.Title = title;
  if (descriptionHtml !== undefined)
    updateData.DescriptionHtml = descriptionHtml;

  const response = await fetch(`${OMNY_BASE_URI}/clips/${clipId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OMNY_API_KEY}`,
    },
    body: JSON.stringify(updateData),
  });

  const updated = await response.json();
  console.log(`Action: Response from omny: ${JSON.stringify(updated)}`)
  return updated;
}
