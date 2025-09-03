export type Company = {
  id?: string | undefined;
  object?: string | undefined;
  createdAt?: string | undefined;
  name?: string | undefined;
  fallbackColor?: string | undefined;
  iconImageUrl?: string | undefined;
  isPlaceholder?: boolean | undefined;
};

export type Network = {
  Name: string;
  TechnicalContactEmailAddresses: string[];
  ReceiveWebhookNotifications: boolean;
  Urls: {
    ImagePublicUrl: string;
  };
  HasImage: boolean;
  TritonMarket: {
    Id: number;
  };
  Deleted: boolean;
  Id: string;
  OrganizationId: string;
  CreatedAtUtc: string;
  CreatedById: string;
  ModifiedAtUtc: string;
  ModifiedById: string;
};

export interface Program {
  Name: string;
  Urls: {
    ImagePublicUrl: string;
    ShowPageUrl: string;
  };
  HasImage: boolean;
  Slug: string;
  Copyright: string | null;
  Author: string;
  Categories: string[];
  Description: string;
  DescriptionHtml: string;
  DefaultPlaylistId: string;
  Unlisted: boolean;
  Hidden: boolean;
  ContactName: string;
  ContactEmail: string;
  ExternalId: string | null;
  AppleSmartBannerEnabled: boolean;
  NetworkId: string;
  Language: string;
  CustomFieldData: Record<string, any>;
  TritonStation: {
    Id: number;
  };
  Deleted: boolean;
  SafePodcastImportRedirectEnabledUntilUtc: string | null;
  Social: {
    WebUrl: string;
    XHandle: string;
    FacebookUsername: string;
    ShowSupportUrl: string;
    ShowSupportLabel: string | null;
  };
  Id: string;
  OrganizationId: string;
  CreatedAtUtc: string;
  CreatedById: string;
  ModifiedAtUtc: string;
  ModifiedById: string;
}

export type Programs = Program[];

export interface Playlist {
  ProgramId: string;
  Title: string;
  Slug: string;
  Description: string;
  Author: string | null;
  DescriptionHtml: string;
  ShortSummary: string;
  SocialWeb: string;
  SortOption: string;
  ContentRating: string;
  PodcastType: string;
  HasImage: boolean;
  NumberOfClips: number;
  Visibility: string;
  Categories: string[];
  DirectoryLinks: {
    RssFeed: string;
    ApplePodcasts: string | null;
    GooglePodcasts: string | null;
    Spotify: string | null;
    TuneIn: string | null;
    IHeart: string | null;
    AmazonMusic: string | null;
    YouTubeMusic: string | null;
  };
  CustomFieldData: Record<string, any>;
  IsSharedWithOtherPrograms: boolean;
  PrivateNotes: string | null;
  RssFeedUrlRedirect: string | null;
  IsRssFeedRedirected: boolean;
  Blocked: boolean;
  MemberDownloadsAdFree: boolean;
  RssFeedPageSize: number;
  Deleted: boolean;
  Urls: {
    ShowPageUrl: string;
    RssFeedUrl: string;
    AdFreeRssFeedUrl: string;
    EmbedUrl: string;
    ImagePublicUrl: string;
  };
  ThirdPartyRssText: {
    ApplePodcastVerify: string | null;
  };
  Id: string;
  OrganizationId: string;
  CreatedAtUtc: string;
  CreatedById: string;
  ModifiedAtUtc: string;
  ModifiedById: string;
}

export type Playlists = Playlist[];
