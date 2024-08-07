"use client";

import { QueryKeyOption } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import type { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import UserTooltip from "./UserTooltip";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({ children, username }: UserLinkWithTooltipProps) {
  const { data } = useQuery({
    queryKey: [QueryKeyOption.USER_DATA, username],
    queryFn: () => kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }

      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link href={`/users/${username}`} className="text-primary hover:underline">
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link href={`/users/${username}`} className="text-primary hover:underline">
        {children}
      </Link>
    </UserTooltip>
  );
}
