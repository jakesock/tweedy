"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { FOR_YOU_QUERY_KEY } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import type { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ForYouFeed() {
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, status } =
    useInfiniteQuery({
      queryKey: FOR_YOU_QUERY_KEY,
      queryFn: ({ pageParam }) =>
        kyInstance
          .get("/api/posts/for-you", pageParam ? { searchParams: { cursor: pageParam } } : {})
          .json<PostsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">No one has posted anything yet.</p>;
  }

  if (status === "error") {
    return <p className="text-center text-destructive">An error occurred while loading posts.</p>;
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
