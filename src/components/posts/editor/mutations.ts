import { useToast } from "@/components/ui/use-toast";
import { FOR_YOU_QUERY_KEY } from "@/lib/constants";
import type { PostsPage } from "@/lib/types";
import type { InfiniteData, QueryFilters } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitPost } from "./actions";

export function useSubmitPostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters = { queryKey: FOR_YOU_QUERY_KEY };

      // cancel running query so mutation doesn't occur during active page fetching
      await queryClient.cancelQueries(queryFilter);

      // modify multiple feeds (profile, for you, etc.)
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(queryFilter, (oldData) => {
        // get first page from old data
        const firstPage = oldData?.pages[0];

        // check if page has loaded yet
        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                // add new post to front of all old posts
                posts: [newPost, ...firstPage.posts],
                // next cursor does not change
                nextCursor: firstPage.nextCursor,
              },
              // remove stale first page and add rest of old pages back into the cache
              ...oldData.pages.slice(1),
            ],
          };
        }
      });

      // in case page has not yet loaded, refetch
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          // invalidate queries where data is null
          return !query.state.data;
        },
      });

      toast({
        description: "Post created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to post. Please try again.",
      });
    },
  });

  return mutation;
}