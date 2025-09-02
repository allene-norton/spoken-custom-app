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
