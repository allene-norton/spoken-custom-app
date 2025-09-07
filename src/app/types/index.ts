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

export interface Clip {
  Title: string;
  Slug: string;
  Description: string;
  DescriptionHtml: string;
  Tags: string[];
  Season: number;
  Episode: number;
  EpisodeType: string;
  Urls: {
    EmbedShareLinkOverrideUrl: string | null;
    ImagePublicUrl: string;
    ImagePrivateUrl: string;
    AudioPublicUrl: string;
    AudioPrivateUrl: string;
    ShowPageUrl: string;
    AudioPublicAdFreeUrl: string;
    EmbedUrl: string;
    WaveformLowResUrl: string;
    WaveformHighResUrl: string;
  };
  DurationSeconds: number;
  PublishedDurationSeconds: number;
  PublishState: string;
  Visibility: string;
  PublishedUtc: string;
  PlaylistIds: string[];
  Chapters: any[]; // You might want to define a Chapter interface if you have chapter data
  State: string;
  RssLinkOverride: string | null;
  ImportedId: string | null;
  Monetization: {
    PreRoll: any; // Define specific structure if needed
    MidRolls: any[]; // Define specific structure if needed
    PostRoll: any; // Define specific structure if needed
    VideoPreRollForEmbedEnabled: boolean;
  };
  RecordingMetadata: any | null;
  ProgramId: string;
  PublishedAudioSizeInBytes: number;
  ContentRating: string;
  AudioOptions: {
    IncludeIntroOutro: boolean;
    AutoLevelAudio: boolean;
  };
  ExternalId: string | null;
  CustomFieldData: Record<string, any>;
  UploadedAudioFileName: string;
  ShortSummary: string | null;
  HasImage: boolean;
  AudioProcessingProblem: any | null;
  AudioProcessingProblemDismissed: boolean;
  CreatedFromAutoPodcast: boolean;
  MemberDownloadsAdFree: boolean;
  TranscriptStatus: string;
  Deleted: boolean;
  VisibleAtUtc: string | null;
  ScheduledVisibility: any | null;
  Id: string;
  OrganizationId: string;
  CreatedAtUtc: string;
  CreatedById: string;
  ModifiedAtUtc: string;
  ModifiedById: string;
}

export type Clips = Clip[];

export type EpisodeType = 'Full' | 'Trailer' | 'Bonus';
export type PublishState = 'Published' | 'Draft' | 'Scheduled' | 'Unpublished';
export type Visibility = 'Public' | 'Private' | 'Unlisted';
export type ClipProcessingState = 'Ready' | 'Processing' | 'Error' | 'Draft' | 'Warning' | 'AudioUploaded' | 'None';
export type ContentRating = 'Clean' | 'Explicit';
export type TranscriptStatus = 'None' | 'Processing' | 'Complete' | 'Error';

export interface Download {
  Downloads: number;
  From: string;
  To: string;
};

export interface DownloadsResponse {
  Items: Download[]
}