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
