"use client";

import { Button } from "@/components/ui/button";
import { NOTIFICATION_COUNT_REFETCH_INTERVAL, QueryKeyOption } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import type { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { BellIcon } from "lucide-react";
import Link from "next/link";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({ initialState }: NotificationsButtonProps) {
  const apiEndpoint = "/api/notifications/unread-count";
  const { data } = useQuery({
    queryKey: [QueryKeyOption.UNREAD_NOTIFICATION_COUNT],
    queryFn: () => kyInstance.get(apiEndpoint).json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: NOTIFICATION_COUNT_REFETCH_INTERVAL,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <BellIcon />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
}
