import {Prisma, PrismaClient} from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";
const prisma = new PrismaClient()
import {z} from "zod"

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    const {text,key} = req.body as { text: string,key:string }// TODO verify key

    const type = z.string()

    try{
        const data = type.parse(text)

        await prisma.paste.create({
            data:{
                userID:key,
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