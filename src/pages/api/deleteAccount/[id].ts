import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { id } = req.query;
    const session = await getServerSession(req, res, authOptions)

    if (!id || !session) {
        res.status(403).send({
            error: "No ID given or not logged in",
            success:false,
        });
        return;
    }

    if(session?.user?.id !== id){
        res.status(403).send({
            error: "You do not have authorisation to delete this account",
            success:false,
        });
        return
    }


    const deletion = await prisma.user.delete({
        where: {
            id: id
        }
    }).catch(_ => {
        res.status(400).send({
            error: "ID not found",
            success:false,
        });
        return
    });

    if (deletion) {
        res.status(200).json({ success: true });
        return;
    }

    res.status(400).json({ success: false });

}