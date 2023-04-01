import {Prisma, PrismaClient} from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";
const prisma = new PrismaClient()
import {z} from "zod"

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    if ((req.body as { pwd: string }).pwd !== process.env.PASSWORD) {
        res.status(400).send({
            error: 'WRONG PASSWORD',
        });
    }


    const {text} = req.body as { text: string }
    const type = z.string()

    try{
        const data = type.parse(text)

        await prisma.post.create({
            data:{
                text:data,
            }
        })
        res.status(200).json({success:"true"})
    }
    catch (e){
        //console.log(e)
        res.status(400).send({
            error:"Failed type check"
        })
    }
}