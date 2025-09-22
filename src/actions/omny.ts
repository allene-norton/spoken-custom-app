import { Network, Clips, Clip, Download } from '@/app/types';

export const omnyKey = process.env.OMNY_API_KEY;

export const OMNY_BASE_URI = 'https://api.omnystudio.com/v1';

export const options = {
  headers: {
    Authorization: `Bearer ${process.env.OMNY_API_KEY}`,
  },
};


// GET NETWORK FILTERED BY COMPANY NAME FROM COPILOT
export async function getNetworkByName(companyName: string | undefined) {
  const response = await fetch(`${OMNY_BASE_URI}/networks`, options);
  const networks = await response.json();
  const network: Network | undefined = networks?.Items.find(
    (network: Network) => network?.Name === companyName,
  );

  return network;
}

// GET PROGRAMS FOR A NETWORK
export async function getProgramsByNetwork(networkId?: string | undefined) {
  const response = await fetch(
    `${OMNY_BASE_URI}/networks/${networkId}/programs`,
    options,
  );
  const programs = await response.json();
  const programsItems = programs.Items

  // GET LIFETIME PROGRAM DOWNLOADS
  // https://api.omnystudio.com/v1/analytics/downloads/lifetime/programs
  
  const programIds = programsItems.map((program: any) => program.Id);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
  const downloadsResponse = await fetch(
    `${OMNY_BASE_URI}/analytics/downloads/lifetime/programs?${programIds.map((id: string) => `programIds=${id}`).join('&')}`,
    options,
  );
  const downloadsData = await downloadsResponse.json();
  const downloadsItems = downloadsData.Items ? downloadsData.Items : null

  // console.log(`ACTION: programs items`, downloadsItems)

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

// GET ALL PLAYLISTS FOR NETWORK [USED TO DISPLAY LATEST CLIPS ON HOME PAGE]
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


// GET CLIPS IN PLAYLIST [USED TO DISPLAY CLIPS]
export async function getClipsByPlaylist(playlistId?: string | undefined) {
  const response = await fetch(
    `${OMNY_BASE_URI}/playlists/${playlistId}/clips`,
    options,
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch clips: ${response.status}`);
  }
  
  const clips = await response.json();
  
  // Handle case where clips.Items might be undefined
  if (!clips?.Items || !Array.isArray(clips.Items)) {
    console.warn('No clips found or invalid response structure');
    return [];
  }
  
  const recentClips = clips.Items.slice(0, 10).map(
    (item: { Clip: Clip }) => item.Clip,
  );

  // add lifetime downloads to clips
  const clipIds = recentClips.map((clip: Clip) => clip.Id);

  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

  try {
    const downloadsResponse = await fetch(
      `${OMNY_BASE_URI}/analytics/downloads/lifetime/clips?${clipIds.map((id: string) => `clipIds=${id}`).join('&')}`,
      options,
    );
    
    if (!downloadsResponse.ok) {
      console.warn('Failed to fetch download analytics, returning clips without download counts');
      return recentClips;
    }
    
    const downloadsData = await downloadsResponse.json();
    const downloadsItems = downloadsData.Items || [];

    // Add downloads to each clip
    if (downloadsItems.length > 0) {
      return recentClips.map((clip: Clip) => ({
        ...clip,
        downloads:
          downloadsItems.find((download: any) => download.Id === clip.Id)
            ?.Count || 0,
      }));
    }
  } catch (error) {
    console.warn('Error fetching download analytics:', error);
  }

  return recentClips;
}


//-----------OG-------------
// export async function getClipsByPlaylist(playlistId?: string | undefined) {
//   const response = await fetch(
//     `${OMNY_BASE_URI}/playlists/${playlistId}/clips`,
//     options,
//   );
//   const clips = await response.json();

//   const recentClips = clips.Items.slice(0, 10).map(
//     (item: { Clip: Clip }) => item.Clip,
//   );

//   // add lifetime downloads to clips
//   // https://api.omnystudio.com/v1/analytics/downloads/lifetime/clips (accepts param arr of clip IDs)

//   const clipIds = recentClips.map((clip: Clip) => clip.Id);

//   await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

//   const downloadsResponse = await fetch(
//     `${OMNY_BASE_URI}/analytics/downloads/lifetime/clips?${clipIds.map((id: string) => `clipIds=${id}`).join('&')}`,
//     options,
//   );
//   const downloadsData = await downloadsResponse.json();

//   const downloadsItems = downloadsData.Items ? downloadsData.Items : null
//   // console.log(`ACTION: downloadItesm`, downloadsItems);

//   // Add downloads to each clip
//   let clipsWithDownloads = recentClips;

//   if (downloadsItems && downloadsItems.length > 0) {
//      clipsWithDownloads = recentClips.map((clip: Clip) => ({
//       ...clip,
//       downloads:
//         downloadsItems.find((download: any) => download.Id === clip.Id)
//           ?.Count || 0,
//     }));

//     // console.log(`ACTION: clips with downloads`, clipsWithDownloads);
//   }

//   return clipsWithDownloads;
// }


// ----------------------------- ANALYTICS ----------------------------

//-----NETWORK ANALYTICS
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

//-----PROGRAM ANALYTICS
export async function getProgramDownloadsByTimeGrouping(
  programId?: string | undefined | null,
  startDate?: string | undefined | null,
  endDate?: string | undefined | null,
  interval?: string | undefined | null,
  timezone?: string | undefined | null,
  // params?: string | undefined
) {
  const response = await fetch(
    `${OMNY_BASE_URI}/programs/${programId}/analytics/downloads?startDate=${startDate}&endDate=${endDate}&interval=${interval}&timeZoneIanaId=${timezone}`,
    options,
  );
  const downloads = await response.json();
  return downloads;
}


//-----CLIP ANALYTICS
export async function getClipDownloadsByTimeGrouping(
  clipId?: string | undefined | null,
  startDate?: string | undefined | null,
  endDate?: string | undefined | null,
  interval?: string | undefined | null,
  timezone?: string | undefined | null,
  // params?: string | undefined
) {
  const response = await fetch(
    `${OMNY_BASE_URI}/clips/${clipId}/analytics/downloads?startDate=${startDate}&endDate=${endDate}&interval=${interval}&timeZoneIanaId=${timezone}`,
    options,
  );
  const downloads = await response.json();
  return downloads;
}



// GET PLAYLISTS BY PROGRAM [USED TO DISPLAY PLAYLISTS ON PROGRAM DETAIL PAGE]
// https://api.omnystudio.com/v1/programs/{programId}/playlists

export async function getPlaylistsByProgram(
  programId?: string | undefined | null,
) {
  if (!programId) {
    return [];
  }

  try {
    const response = await fetch(
      `${OMNY_BASE_URI}/programs/${programId}/playlists`,
      options,
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const playlists = await response.json();
    
    // Ensure we return serializable data
    return playlists.Items || [];
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
}


// UPDATE CLIP [USED TO UPDATE TITLE AND DESCRIPTION FROM CLIP DETAILS PAGE]

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
