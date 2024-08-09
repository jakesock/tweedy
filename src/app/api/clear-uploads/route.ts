import { ONE_DAY_MS } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ message: "Invalid authorization header" }, { status: 401 });
    }

    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        // Only delete orphaned media if it is older than 24 hours
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - ONE_DAY_MS),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    const filesToDelete = unusedMedia.map(
      (media) => media.url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]
    );

    new UTApi().deleteFiles(filesToDelete as string[]);

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((media) => media.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
