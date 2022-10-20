export type Feed = unknown;

export type FAuthor = unknown;

export type FMember = unknown;

export type FAction = unknown;

export type FItem = unknown;

export type FRequest = unknown;

export interface NewsFeedAdapter {
  getNewsFeed(
    userId: string,
    options?: {
      afterPostId: number;
      count: number;
      excludeReplies: boolean;
    }
  ): Array<object>;
}

export interface ActivityNotificationsAdapter {
  user_activity_identifier: string;
}
