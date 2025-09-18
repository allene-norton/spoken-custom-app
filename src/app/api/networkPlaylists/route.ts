import { type NextRequest, NextResponse } from 'next/server';
import { getPlaylistsByNetwork } from "@/actions/omny";


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const networkId = searchParams.get('networkId');

  // console.log(`networkPlaylistsRoute`, networkId)

  const playlistData = await getPlaylistsByNetwork(networkId);
  // console.log(playlistData)
  // console.log(`networkPlaylistsRoutePlaylists`, playlistData[0])

  return NextResponse.json(playlistData);
}