"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import type { PostData } from "@/lib/types";
import { getPostDataInclude } from "@/lib/utils";
import type { CreatePostValues } from "@/lib/validation";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: CreatePostValues): Promise<PostData> {
  const { user } = await validateRequest();

  if (!user) throw Error("unauthorized");

  const { content, mediaIds } = createPostSchema.parse(input);

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
