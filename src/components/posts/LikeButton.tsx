import { QueryKeyOption } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import type { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = [QueryKeyOption.LIKE_INFO, postId];
  const likeEndpoint = `/api/posts/${postId}/likes`;

  const { data } = useQuery({
    queryKey,
    queryFn: () => kyInstance.get(likeEndpoint).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser ? kyInstance.delete(likeEndpoint) : kyInstance.post(likeEndpoint),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const prevState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes: (prevState?.likes || 0) + (prevState?.likes ? -1 : 1),
        isLikedByUser: !prevState?.isLikedByUser,
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
      <HeartIcon className={cn("size-5", data.isLikedByUser && "fill-red-500 text-red-500")} />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">{data.likes === 1 ? "like" : "likes"}</span>
      </span>
    </button>
  );
}
