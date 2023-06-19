// TODO: move all user functions here
import { createTRPCRouter, isAllowedProcedure, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({

    getUserDefaultGroup: protectedProcedure
        .input(z.object({
            userID: z.string()
        }))
        .query(async ({ input: { userID }, ctx: { prisma } }) => {
            try {
                return await prisma.user.findUnique({
                    where: {
                        id: userID
                    },
                    select:{
                        defaultPasteGroup:true
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),
    updateDefaultGroup: protectedProcedure
        .input(z.object({
            id: z.string(),
            groupName: z.string()
        }))
        .mutation(async ({ input: { id, groupName }, ctx: { prisma } }) => {
            try {
                return await prisma.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        defaultPasteGroup: groupName
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to update");
            }
        }),
})

