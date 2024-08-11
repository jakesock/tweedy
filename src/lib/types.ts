import type { Prisma } from "@prisma/client";
import type { getPostDataInclude, getUserDataSelect } from "./utils";

type PowOf2 = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024;
type SizeUnit = "B" | "KB" | "MB" | "GB";
export type FileSize = `${PowOf2}${SizeUnit}`;

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export interface PostsPage {
  posts: PostData[];
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

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}
