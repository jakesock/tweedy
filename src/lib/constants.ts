import type { Prisma } from "@prisma/client";

export const DEFAULT_USER_AVATAR_SIZE = 48;
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
export const TRENDING_TOPICS_REVALIDATE_TIME = 3 * 60 * 60;

export enum ThemeOption {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const postDataInclude = {
  user: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude;
