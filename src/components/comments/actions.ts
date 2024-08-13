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

  const [newComment] = await prisma.$transaction(async (prisma) => {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    });

    if (post.user.id !== user.id) {
      await prisma.notification.create({
        data: {
          issuerId: user.id,
          recipientId: post.user.id,
          postId: post.id,
          commentId: newComment.id,
          type: "COMMENT",
        },
      });
    }

    return [newComment];
  });

  return newComment;
}

export async function deleteComment(commentId: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id: comment.postId },
    select: { userId: true },
  });
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  const [deletedComment] = await prisma.$transaction([
    prisma.comment.delete({
      where: { id: commentId },
      include: getCommentDataInclude(user.id),
    }),
    prisma.notification.deleteMany({
      where: {
        issuerId: user.id,
        recipientId: post.userId,
        postId: comment.postId,
        commentId,
        type: "COMMENT",
      },
    }),
  ]);

  return deletedComment;
}
