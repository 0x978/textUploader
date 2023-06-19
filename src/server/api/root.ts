import { createTRPCRouter } from "~/server/api/trpc";
import { textRouter } from "~/server/api/routers/textRouter";
import { userRouter } from "~/server/api/routers/userRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    text: textRouter,
    user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
