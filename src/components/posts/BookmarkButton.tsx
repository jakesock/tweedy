import { QueryKeyOption } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import type { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = [QueryKeyOption.BOOKMARK_INFO, postId];
  const bookmarkEndpoint = `/api/posts/${postId}/bookmark`;

  const { data } = useQuery({
    queryKey,
    queryFn: () => kyInstance.get(bookmarkEndpoint).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(bookmarkEndpoint)
        : kyInstance.post(bookmarkEndpoint),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? "removed from" : "saved to"} bookmarks`,
      });

      await queryClient.cancelQueries({ queryKey });

      const prevState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !prevState?.isBookmarkedByUser,
      }));

      return { prevState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.prevState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again.",
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <BookmarkIcon
        className={cn("size-5", data.isBookmarkedByUser && "fill-primary text-primary")}
      />
    </button>
  );
}
