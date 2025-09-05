import { Network, Clips, Clip } from '@/app/types';

const omnyKey = process.env.OMNY_API_KEY;

const OMNY_BASE_URI = 'https://api.omnystudio.com/v1';

const options = {
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
  return playlists.Items
}

export async function getClipsByPlaylist(playlistId?: string | undefined) {
  const response = await fetch(
    `${OMNY_BASE_URI}/playlists/${playlistId}/clips`,
    options,
  );
  const clips = await response.json();
  const recentClips = clips.Items.slice(0, 10).map((item: {Clip: Clip}) => item.Clip);
  return recentClips
}

/* 
TODO: Sept. 3, 2025:
Get all playlists for a network (done)
  > Create type for playlist (done)
  > Sort by last modified date (done, automatic)
Get clips by playlist (done)
  > Create type for clips (done)
   commit before import v0

Render 10 latest clips for network on home page (done)
  > Status icon, image, name, publish date (done)
  > Color by status (done)

Render program images as tiles (done)

Create array of clip objects for 3 most recent playlists
  > Sort by ModifiedAtUtc latest - earliest

Clip >
  Render clip image, title, description, status, publish date

Program > 
  Render playlists on the left
  Render latest clips for latest playlists on the right

*/
