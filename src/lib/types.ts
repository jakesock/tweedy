import type { Prisma } from "@prisma/client";
import type {
  getCommentDataInclude,
  getPostDataInclude,
  getUserDataSelect,
  notificationsInclude,
} from "./utils";

type PowOf2 = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024;
type SizeUnit = "B" | "KB" | "MB" | "GB";
export type FileSize = `${PowOf2}${SizeUnit}`;

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;
export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;
export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;
export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}
export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}
export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}
export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}
export interface NotificationCountInfo {
  unreadCount: number;
}

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}
