import { QueryKeyOption } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import type { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(userId: string, initialState: FollowerInfo) {
  const query = useQuery({
    queryKey: [QueryKeyOption.FOLLOWER_INFO, userId],
    queryFn: () => kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    // Keep it from automatically revalidating. Only revalidate if we ask it to.
    staleTime: Infinity,
  });

  return query;
}
