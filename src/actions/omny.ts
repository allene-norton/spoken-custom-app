import { Network } from "@/app/types"

const omnyKey = process.env.OMNY_API_KEY

const OMNY_BASE_URI= "https://api.omnystudio.com/v1"

const options = {
   headers: {
    'Authorization': `Bearer ${process.env.OMNY_API_KEY}`
  }
}

export async function getNetworkByName (companyName: string | undefined){
  const response = await fetch(`${OMNY_BASE_URI}/networks`, options)
  const networks = await response.json()
   const network: Network | undefined = networks?.Items.find(
    (network: Network) => network.Name === companyName,
  );

  return network
}

export async function getProgramsByNetwork(networkId?: string | undefined) {
  const response = await fetch(`${OMNY_BASE_URI}/networks/${networkId}/programs`, options)
  const programs = await response.json()
  return programs.Items
}

export async function getPlaylistsByNetwork(networkId?: string | undefined) {
  const response = await fetch(`${OMNY_BASE_URI}/networks/${networkId}/playlists`, options)
  const playlists = await response.json()
  return playlists.Items
}

export async function getClipsByPlaylist(playlistId?: string | undefined) {
  const response = await fetch(`${OMNY_BASE_URI}/playlists/${playlistId}/clips`, options)
  const clips = await response.json()
  return clips.Items
}

/* 
TODO: Sept. 3, 2025:
Get all playlists for a network (done)
  > Create type for playlist
  > Sort by last modified date

Get clips by playlist
  > Create type for clips

Create array of clip objects for all playlists
  > Sort by date latest - earliest

Render 10 latest clips for network on home page (clickable)
  > Status icon, image, name, publish date 
  > Color by status

Render program images as clickable tiles

Clip >
  Render clip image, title, description, status, publish date


Program > 
  Render playlists on the left
  Render latest clips for latest playlists on the right

*/