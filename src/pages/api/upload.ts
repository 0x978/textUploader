import {PrismaClient} from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";
const prisma = new PrismaClient()
import {z} from "zod"

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    const {text,key} = req.body as { text: string,key:string }// TODO verify key

    if(!await checkUserExists(key)){
        res.status(403).send({
            error:"Failed to find user, please check key."
        })
    }

    const type = z.string()

    try{
        const data = type.parse(text)

        const paste = await prisma.paste.create({
            data:{
                userID:key,
                text:data,
            }
        })
        console.log(paste)
        res.status(200).json({success:"true",url:"http://localhost:3000/rawPasteDisplay/?id="+paste.id})
    }
    catch (e){
        //console.log(e)
        res.status(400).send({
            error:"Failed type check"
        })
    }
}

async function checkUserExists(key:string):Promise<boolean>{
    try{
        const user = await prisma.user.findUnique({
            where:{
                id:key
            }
        })
        if(!user){
            return false
        }
    }
    catch (e){
        return false;
    }

    return true;
}