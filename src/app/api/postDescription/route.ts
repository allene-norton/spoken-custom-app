import { NextRequest, NextResponse } from 'next/server';
import { updateClip } from '@/actions/omny';

export async function PATCH( request: NextRequest) {
  try {

    const {clipId, title, descriptionHtml} = await request.json()

    console.log(`Route: Clip ID is ${clipId}`);

    const data = await updateClip(clipId, title, descriptionHtml)

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update clip' },
      { status: 500 },
    );
  }
}
