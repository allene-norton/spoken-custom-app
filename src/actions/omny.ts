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
  const programsItems = programs.Items

  // get program downloads
  // https://api.omnystudio.com/v1/analytics/downloads/lifetime/programs
  
  const programIds = programsItems.map((program: any) => program.Id);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
  const downloadsResponse = await fetch(
    `${OMNY_BASE_URI}/analytics/downloads/lifetime/programs?${programIds.map((id: string) => `programIds=${id}`).join('&')}`,
    options,
  );
  const downloadsData = await downloadsResponse.json();
  const downloadsItems = downloadsData.Items ? downloadsData.Items : null

  console.log(`ACTION: programs items`, downloadsItems)

  // Add downloads to each program
  let programsWithDownloads = programsItems;
  if (downloadsItems && downloadsItems.length > 0) {
    programsWithDownloads = programsItems.map((program: any) => ({
      ...program,
      downloads:
        downloadsItems.find((download: any) => download.Id === program.Id)
          ?.Count || 0,
    }));
  }

  return programsWithDownloads;
}

export async function getPlaylistsByNetwork(
  networkId?: string | null | undefined,
) {
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

  // add lifetime downloads to clips
  // https://api.omnystudio.com/v1/analytics/downloads/lifetime/clips (accepts param arr of clip IDs)

  const clipIds = recentClips.map((clip: Clip) => clip.Id);

  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

  const downloadsResponse = await fetch(
    `${OMNY_BASE_URI}/analytics/downloads/lifetime/clips?${clipIds.map((id: string) => `clipIds=${id}`).join('&')}`,
    options,
  );
  const downloadsData = await downloadsResponse.json();

  const downloadsItems = downloadsData.Items ? downloadsData.Items : null
  // console.log(`ACTION: downloadItesm`, downloadsItems);

  // Add downloads to each clip
  let clipsWithDownloads = recentClips;

  if (downloadsItems && downloadsItems.length > 0) {
     clipsWithDownloads = recentClips.map((clip: Clip) => ({
      ...clip,
      downloads:
        downloadsItems.find((download: any) => download.Id === clip.Id)
          ?.Count || 0,
    }));

    // console.log(`ACTION: clips with downloads`, clipsWithDownloads);
  }

  return clipsWithDownloads;
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
  // console.log(`ACTION RETURNING:`, updated)
  return updated;
}
