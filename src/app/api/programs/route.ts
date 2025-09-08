import { type NextRequest, NextResponse } from 'next/server';
import { getPlaylistsByProgram } from '@/actions/omny';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const programId = searchParams.get('programId');

  const playlistData = await getPlaylistsByProgram(programId);
  // console.log(playlistData)

  const mockData = {
    ProgramId: '938afd0a-06ac-477a-b063-a7310005bfa8',
    Title: "The Debrief with Dave O'Neil",
    Slug: 'podcast-1',
    Description:
      "The gig's just finished and comedian Dave O’Neil drives a comedian friend home, reflecting on the highs and lows of doing stand up comedy.\n" +
      '\n' +
      'You’ll be transported to Dave’s station wagon as he drives home from comedy gigs and debriefs with other comics about that night’s triumphs and disasters.\n' +
      '\n' +
      'Produced by Nearly. www.nearly.com.au/thedebrief',
    Author: null,
    DescriptionHtml:
      "<p>The gig's just finished and comedian Dave O&rsquo;Neil drives a comedian friend home, reflecting on the highs and lows of doing stand up comedy.</p>\n" +
      '<p>You&rsquo;ll be transported to Dave&rsquo;s station wagon as he drives home from comedy gigs and debriefs with other comics about that night&rsquo;s triumphs and disasters.</p>\n' +
      '<p>Produced by Nearly. www.nearly.com.au/thedebrief</p>',
    ShortSummary:
      "The gig's just finished and comedian Dave O’Neil calls a comedian friend to reflect on the highs and lows of doing stand up comedy.",
    SocialWeb: 'https://www.nearly.com.au/thedebrief',
    SortOption: 'AutomaticDateDescending',
    ContentRating: 'Explicit',
    PodcastType: 'Episodic',
    HasImage: true,
    NumberOfClips: 206,
    Visibility: 'Public',
    Categories: ['Comedy'],
    DirectoryLinks: {
      RssFeed:
        'https://www.omnycontent.com/d/playlist/cf92379f-6cb4-4ad2-8504-a7310004d9dd/938afd0a-06ac-477a-b063-a7310005bfa8/fde3d2a4-e215-4886-a907-a7310033b155/podcast.rss',
      ApplePodcasts:
        'https://itunes.apple.com/au/podcast/the-debrief-with-dave-oneil/id1255075233?mt=2',
      GooglePodcasts: null,
      Spotify:
        'https://open.spotify.com/show/6D0Tzicgi9JpeehgNx1NJl?si=CQVKAYZyTKavYHF92F_v3g',
      TuneIn: null,
      IHeart: null,
      AmazonMusic: null,
      YouTubeMusic: null,
    },
    CustomFieldData: {},
    IsSharedWithOtherPrograms: true,
    PrivateNotes: null,
    RssFeedUrlRedirect: 'https://feeds.megaphone.fm/the-debrief',
    IsRssFeedRedirected: false,
    Blocked: false,
    MemberDownloadsAdFree: true,
    RssFeedPageSize: 0,
    Deleted: false,
    Urls: {
      ShowPageUrl:
        'https://omny.fm/shows/debriefwithdaveoneil/playlists/podcast-1',
      RssFeedUrl:
        'https://www.omnycontent.com/d/playlist/cf92379f-6cb4-4ad2-8504-a7310004d9dd/938afd0a-06ac-477a-b063-a7310005bfa8/fde3d2a4-e215-4886-a907-a7310033b155/podcast.rss',
      AdFreeRssFeedUrl:
        'https://www.omnycontent.com/d/playlist/cf92379f-6cb4-4ad2-8504-a7310004d9dd/938afd0a-06ac-477a-b063-a7310005bfa8/fde3d2a4-e215-4886-a907-a7310033b155/podcast.rss?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6IkxranY5cm5SamtxUWxxdU9BV0tqQnciLCJ0eXAiOiJKV1QifQ.eyJwbGF5bGlzdCI6ImZkZTNkMmE0LWUyMTUtNDg4Ni1hOTA3LWE3MzEwMDMzYjE1NSIsImFkcyI6MH0.Z48NhqTp2BGuku_Ivf_YRwjQyvf_kK7Jj5PXNQTqcY8',
      EmbedUrl:
        'https://omny.fm/shows/debriefwithdaveoneil/playlists/podcast-1/embed',
      ImagePublicUrl:
        'https://www.omnycontent.com/d/playlist/cf92379f-6cb4-4ad2-8504-a7310004d9dd/938afd0a-06ac-477a-b063-a7310005bfa8/fde3d2a4-e215-4886-a907-a7310033b155/image.jpg?t=1504563201&size=Medium',
    },
    ThirdPartyRssText: { ApplePodcastVerify: null },
    Id: 'fde3d2a4-e215-4886-a907-a7310033b155',
    OrganizationId: 'cf92379f-6cb4-4ad2-8504-a7310004d9dd',
    CreatedAtUtc: '2017-03-09T03:08:12.443Z',
    CreatedById: '223472b3-9e47-4ad0-b040-a73100040fc1',
    ModifiedAtUtc: '2025-08-27T11:17:34.123Z',
    ModifiedById: '223472b3-9e47-4ad0-b040-a73100040fc1',
  };

  return NextResponse.json(playlistData);
}
