import { validateRequest } from "@/auth";
import { NUM_NOTIFICATIONS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import type { NotificationsPage } from "@/lib/types";
import { notificationsInclude } from "@/lib/utils";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = NUM_NOTIFICATIONS_PER_PAGE;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationsInclude,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      notifications.length > pageSize && notifications[pageSize]
        ? notifications[pageSize].id
        : null;

    const data: NotificationsPage = {
      notifications: notifications.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
