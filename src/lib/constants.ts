import type { Prisma } from "@prisma/client";

export const DEFAULT_USER_AVATAR_SIZE = 48;

export enum ThemeOption {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export const postDataInclude = {
  user: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude;

export const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
