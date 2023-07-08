import {PrismaClient } from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";
const prisma = new PrismaClient()
import {z} from "zod"

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    const {text,key} = req.body as { text: string,key:string }// TODO verify key

    const userID = await findUserIDFromKey(key);

    if(!userID){
        res.status(403).send({
            error:"Failed to find user, please check key."
        })
        return
    }

    const group = await groupfromUserID(userID) ?? "none"

    const type = z.string()

    try{
        const data = type.parse(text)

        const paste = await prisma.paste.create({
            data:{
                userID:userID,
                text:data,
                group:group,
            }
        })
        res.status(200).json({success:"true",url:"https://text.0x978.com/"+paste.accessID})
    }
    catch (e){
        //console.log(e)
        res.status(400).send({
            error:"Failed type check"
        })
    }
}

async function findUserIDFromKey(key:string):Promise<string | undefined>{
    try{
        const userID = await prisma.user.findUnique({
            where:{
                key:key
            },
            select:{
                id:true
            }
        })
        if(!userID){
            return undefined
        }
        else{
            return userID.id
        }
    }
    catch (e){
        return undefined;
    }
}

async function groupfromUserID(id:string):Promise<string | undefined>{
    try{
        const data = await prisma.user.findUnique({
            where:{
                id:id
            },
            select:{
                defaultPasteGroup:true
            }
        })
        if(!data){
            return "none"
        }
        else{
            return data.defaultPasteGroup
        }
    }
    catch (e){
        return undefined;
    }
}