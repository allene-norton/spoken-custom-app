import { type NextRequest, NextResponse } from 'next/server';
import { getPlaylistsByProgram } from '@/actions/omny';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const programId = searchParams.get('programId');

  const playlistData = await getPlaylistsByProgram(programId);
  // console.log(playlistData)

  return NextResponse.json(playlistData);
}
