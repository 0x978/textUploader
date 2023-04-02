import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";

export const textRouter = createTRPCRouter({

    getAllText: publicProcedure
      .input(z.object({
          userID:z.string()
      }))
        .query(async ({ input:{userID},ctx: { prisma } }) => {
            try {
                return await prisma.paste.findMany({
                    orderBy: {
                        createdAt: 'desc',
                    },
                    where:{
                        userID: userID,
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch');
            }
        }),

    getAllTextByGroup: publicProcedure
        .input(z.object({
            group:z.string(),
            userID:z.string()
        }))
        .query(async ({ input:{group,userID} ,ctx: { prisma } }) => {
            try {
                return await prisma.paste.findMany({
                    orderBy: {
                        createdAt: 'desc',
                    },
                    where:{
                        userID: userID,
                        group:group
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch');
            }
        }),

    deleteText: publicProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ input: { id }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.delete({
                    where:{
                        id:id
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch');
            }
        }),

    getTextByID: publicProcedure
        .input(z.object({
            textID: z.string(),
        }))
        .query(async ({ input: { textID }, ctx: { prisma } }) => {
            try {
                return await prisma.paste.findUnique({
                    where: {
                        id:textID,
                    },
                });
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch');
            }
        }),

    updateTitle: publicProcedure
        .input(z.object({
            id: z.string(),
            title: z.string(),
        }))
        .mutation(async ({ input: { id ,title}, ctx: { prisma } }) => {
            try {
                return await prisma.paste.update({
                    where:{
                        id:id
                    },
                    data:{
                        title:title
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch');
            }
        }),

    updateText: publicProcedure
      .input(z.object({
          id: z.string(),
          text: z.string(),
      }))
      .mutation(async ({ input: { id ,text}, ctx: { prisma } }) => {
          try {
              return await prisma.paste.update({
                  where:{
                      id:id
                  },
                  data:{
                      text:text
                  }
              });
          } catch (error) {
              console.error(error);
              throw new Error('Failed to fetch');
          }
      }),

    submitPost: publicProcedure
        .input(z.object({
            title: z.string(),
            group:z.string(),
            text:z.string(),
            userID:z.string()
        }))
        .mutation(async ({ input: { title,group,text,userID}, ctx: { prisma } }) => {
            try {
                return await prisma.paste.create({
                    data:{
                        title:title,
                        group: group,
                        text: text,
                        userID:userID
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch');
            }
        }),

    updateGroup: publicProcedure
        .input(z.object({
            id: z.string(),
            group: z.string(),
        }))
        .mutation(async ({ input: { id ,group}, ctx: { prisma } }) => {
            try {
                return await prisma.paste.update({
                    where:{
                        id:id
                    },
                    data:{
                        group:group
                    }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch');
            }
        }),

})
