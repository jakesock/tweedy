"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { QueryKeyOption } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import type { NotificationsPage } from "@/lib/types";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import Notification from "./Notification";

export default function Notifications() {
  const getNotificationsAPIEndpoint = "/api/notifications";
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [QueryKeyOption.NOTIFICATIONS],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            getNotificationsAPIEndpoint,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
          )
          .json<NotificationsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const patchNotificationsMarkAsReadAPIEndpoint = "/api/notifications/mark-as-read";
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch(patchNotificationsMarkAsReadAPIEndpoint),
    onSuccess() {
      queryClient.setQueryData([QueryKeyOption.UNREAD_NOTIFICATION_COUNT], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error("Failed to mark notificaitons as read.", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending") {
    // TODO: Create Notifications Loading Skeleton
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any notifications yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">An error occurred while loading notifications.</p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
