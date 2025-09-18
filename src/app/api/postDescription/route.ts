import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: { clipId: string } }) {
  const { clipId } = params;
  const { DescriptionHtml } = await request.json();

  try {
    const response = await fetch(`https://api.omnystudio.com/v1/clips/${clipId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ DescriptionHtml }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update clip' }, { status: 500 });
  }
}