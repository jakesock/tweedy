"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import type { PostData } from "@/lib/types";
import { getCommentDataInclude } from "@/lib/utils";
import type { CreateCommentValues } from "@/lib/validation";
import { createCommentSchema } from "@/lib/validation";

interface SubmitCommentParams {
  post: PostData;
  input: CreateCommentValues;
}

export async function submitComment({ post, input }: SubmitCommentParams) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  const { content } = createCommentSchema.parse(input);

  const newComment = await prisma.comment.create({
    data: {
      content,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  });

  return newComment;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) throw new Error("Comment not found");
  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
