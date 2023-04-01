import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";

export const textRouter = createTRPCRouter({

    getAllText: publicProcedure
        .query(async ({ ctx: { prisma } }) => {
            try {
                return await prisma.post.findMany({
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch');
            }
        }),

    getAllTextByGroup: publicProcedure
        .input(z.object({
            group:z.string()
        }))
        .query(async ({ input:{group} ,ctx: { prisma } }) => {
            try {
                return await prisma.post.findMany({
                    orderBy: {
                        createdAt: 'desc',
                    },
                    where:{
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
                return await prisma.post.delete({
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
                return await prisma.post.findUnique({
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
                return await prisma.post.update({
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
              return await prisma.post.update({
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
        }))
        .mutation(async ({ input: { title,group,text}, ctx: { prisma } }) => {
            try {
                return await prisma.post.create({
                    data:{
                        title:title,
                        group: group,
                        text: text,
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
                return await prisma.post.update({
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
