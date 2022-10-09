import { NewsFeedAdapter } from "./types";

export default class ContentFeed implements NewsFeedAdapter {
  getNewsFeed(
    userId: string,
    options?: { afterPostId: number; count: number; excludeReplies: boolean }
  ): object[] {
    throw new Error("Method not implemented.");
  }
}
