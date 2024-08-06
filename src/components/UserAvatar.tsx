import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image from "next/image";

const DEFAULT_USER_AVATAR_SIZE = 48;

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({ avatarUrl, size, className }: UserAvatarProps) {
  const avatarSize = size ?? DEFAULT_USER_AVATAR_SIZE;

  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt="User avatar"
      width={avatarSize}
      height={avatarSize}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className
      )}
    />
  );
}
