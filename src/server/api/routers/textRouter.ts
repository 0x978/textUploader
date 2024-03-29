import { createTRPCRouter, isAllowedProcedure, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import logger from "~/components/API/logger";

export const textRouter = createTRPCRouter({
    getAllText: protectedProcedure
        .input(z.object({
            userID: z.string()
        }))
        .query(async ({ input: { userID }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.findMany({
                    orderBy: {
                        createdAt: "desc"
                    },
                    where: {
                        userID: userID
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    getAllGroupsByUserID: protectedProcedure
        .input(z.object({
            userID: z.string()
        }))
        .query(async ({ input: { userID }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.findMany({
                    orderBy: {
                        createdAt: "desc"
                    },
                    where: {
                        userID: userID
                    },
                    select:{
                        group:true,
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    getAllTextByGroup: protectedProcedure
        .input(z.object({
            group: z.string(),
            userID: z.string()
        }))
        .query(async ({ input: { group, userID }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.findMany({
                    orderBy: {
                        createdAt: "desc"
                    },
                    where: {
                        userID: userID,
                        group: group
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    deleteText: isAllowedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ input: { id }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.delete({
                    where: {
                        id: id
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    getTextByID: protectedProcedure
        .input(z.object({
            pasteAccessID: z.string()
        }))
        .query(async ({ input: { pasteAccessID }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.findUnique({
                    where: {
                        accessID: pasteAccessID
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    getPasteByIDPrivate: publicProcedure
        .input(z.object({
            pasteAccessID: z.string()
        }))
        .query(async ({ input: { pasteAccessID }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.findUnique({
                    where: {
                        accessID: pasteAccessID
                    },
                    select:{
                        text:true,
                        title:true,
                        createdAt:true,
                        views:true,
                        group:true,
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    doesPasteExist: publicProcedure
        .input(z.object({
            pasteAccessID: z.string()
        }))
        .query(async ({ input: { pasteAccessID }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.findUnique({
                    where: {
                        accessID: pasteAccessID
                    },
                });
            } catch (error) {
                throw new Error("Id Does not Exist");
            }
        }),

    updateTitle: protectedProcedure
        .input(z.object({
            id: z.string(),
            title: z.string()
        }))
        .mutation(async ({ input: { id, title }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.update({
                    where: {
                        id: id
                    },
                    data: {
                        title: title
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    updateURL: protectedProcedure
        .input(z.object({
            id: z.string(),
            accessID: z.string()
        }))
        .mutation(async ({ input: { id, accessID }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.update({
                    where: {
                        id: id
                    },
                    data: {
                        accessID: accessID
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    updateText: protectedProcedure
        .input(z.object({
            id: z.string(),
            text: z.string(),
            date: z.date()
        }))
        .mutation(async ({ input: { id, text ,date}, ctx: { prisma } }) => {
            try {
                return await prisma.paste.update({
                    where: {
                        id: id,
                    },
                    data: {
                        text: text,
                        lastModified: date,
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    submitPost: publicProcedure
        .input(z.object({
            title: z.string(),
            group: z.string(),
            text: z.string(),
            userID: z.string(),
            isPrivate: z.boolean(),
        }))
        .mutation(async ({ input: { title, group, text, userID,isPrivate}, ctx: { prisma } }) => {
            try {
                await logger("Paste Submitted",true,[["USER ID",userID]])
                return await prisma.paste.create({
                    data: {
                        title: title,
                        group: group,
                        text: text,
                        userID: userID,
                        isPrivate: isPrivate,
                    }
                });
            } catch (error) {
                await logger("SUBMISSION ERROR",true,[["ERROR",error as string]])
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    updateGroup: protectedProcedure
        .input(z.object({
            id: z.string(),
            group: z.string()
        }))
        .mutation(async ({ input: { id, group }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.update({
                    where: {
                        id: id
                    },
                    data: {
                        group: group
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    updateGroupName: protectedProcedure
        .input(z.object({
            id: z.string(),
            oldGroup: z.string(),
            newGroup:z.string(),
        }))
        .mutation(async ({ input: { id, oldGroup,newGroup}, ctx: { prisma } }) => {
            try {
                return await prisma.paste.updateMany({
                    where: {
                        userID: id,
                        group:oldGroup,
                    },
                    data: {
                        group: newGroup
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    updateViews: publicProcedure
        .input(z.object({
            id: z.string(),
            updatedViewsCount: z.number(),
        }))
        .mutation(async ({ input: { id, updatedViewsCount }, ctx: { prisma } }) => {
            try {
                await prisma.paste.update({
                    where: {
                        accessID: id
                    },
                    data: {
                        views: updatedViewsCount
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    // deleteAccount: protectedProcedure
    //     .input(z.object({
    //         id: z.string(),
    //     }))
    //     .mutation(async ({ input: { id }, ctx: { prisma } }) => {
    //         try {
    //             return await prisma.paste.delete({
    //                 where: {
    //                     id: id
    //                 },
    //             });
    //         } catch (error) {
    //             console.error(error);
    //             throw new Error("Failed to fetch");
    //         }
    //     }),

    updateKey: protectedProcedure
        .input(z.object({
            id: z.string(),
            key: z.string(),
        }))
        .mutation(async ({ input: { id,key}, ctx: { prisma } }) => {
            try {
                return await prisma.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        key: key
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    getUserKeyByID: protectedProcedure
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
                        key:true,
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch");
            }
        }),

    reportPost: publicProcedure
        .input(z.object({
            postAccessID:z.string(),
            reason: z.string(),
            reportingUserID: z.string().optional(),
        }))
        .mutation(async ({ input: { postAccessID ,reason,reportingUserID}, ctx: { prisma } }) => {
            await logger("REPORT SUBMITTED",true,[["REPORTING USER ID",reportingUserID ?? "NOT DEFINED"],["POST ACCESS ID",postAccessID],["REASON",reason]])
            try {
                return await prisma.report.create({
                    data: {
                        postAccessID: postAccessID ,
                        reason:reason,
                        reportingUserID:reportingUserID
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to post report");
            }
        }),

    updatePastePrivacy: isAllowedProcedure
        .input(z.object({
            id: z.string(),
            setPrivacyLevel: z.boolean(),
        }))
        .mutation(async ({ input: { id, setPrivacyLevel }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.update({
                    where: {
                        id: id
                    },
                    data: {
                        isPrivate: setPrivacyLevel
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to update");
            }
        }),


});
