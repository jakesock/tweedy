import type { Prisma } from "@prisma/client";
import type { postDataInclude } from "./constants";

export type PostData = Prisma.PostGetPayload<{ include: typeof postDataInclude }>;
