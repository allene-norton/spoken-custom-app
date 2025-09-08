import { type NextRequest, NextResponse } from 'next/server';
import { getClipsByPlaylist } from '@/actions/omny';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const playlistId = searchParams.get('playlistId');

  if (!playlistId) {
    return NextResponse.json(
      { error: 'Playlist ID is required' },
      { status: 400 },
    );
  }

  const playlistData = await getClipsByPlaylist(playlistId);
  // console.log(playlistData)

  return NextResponse.json(playlistData);
}
