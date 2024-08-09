import { validateRequest } from "@/auth";
import {
  MAX_IMAGE_ATTACHMENT_FILE_SIZE,
  MAX_NUM_FILES_PER_UPLOAD,
  MAX_VIDEO_ATTACHMENT_FILE_SIZE,
} from "@/lib/constants";
import prisma from "@/lib/prisma";
import type { FileRouter } from "uploadthing/next";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      // check user if validated
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Delete Old Avatar if it exists
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1];

        if (key) {
          await new UTApi().deleteFiles(key);
        }
      }

      // replace default public URL with private app url
      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      // update user with new avatar url
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });

      return { avatarUrl: newAvatarUrl };
    }),
  attachment: f({
    image: { maxFileSize: MAX_IMAGE_ATTACHMENT_FILE_SIZE, maxFileCount: MAX_NUM_FILES_PER_UPLOAD },
    video: { maxFileSize: MAX_VIDEO_ATTACHMENT_FILE_SIZE, maxFileCount: MAX_NUM_FILES_PER_UPLOAD },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`),
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
