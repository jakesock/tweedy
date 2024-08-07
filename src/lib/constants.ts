export const DEFAULT_USER_AVATAR_SIZE = 48;
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
export const TRENDING_TOPICS_REVALIDATE_TIME = 3 * 60 * 60;
export const NUM_POSTS_PER_PAGE = 10;

export enum ThemeOption {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum QueryKeyOption {
  POST_FEED = "post-feed",
  FOR_YOU = "for-you",
  FOLLOWING_FEED = "following-feed",
  FOLLOWER_INFO = "follower-info",
}
export const FOR_YOU_QUERY_KEY = [QueryKeyOption.POST_FEED, QueryKeyOption.FOR_YOU];
export const FOLLOWING_FEED_QUERY_KEY = [QueryKeyOption.POST_FEED, QueryKeyOption.FOLLOWING_FEED];
