export type Feed = {};

export type FAuthor = {};

export type FMember = {};

export type FAction = {};

export type FItem = {};

export type FRequest = {};

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
