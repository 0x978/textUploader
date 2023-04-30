import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { id } = req.query;

    if (!id) {
        res.status(403).send({
            error: "No ID given"
        });
        return;
    }

    const paste = await prisma.paste.findUnique({
        where: {
            accessID: id as string
        }
    });

    if (paste) {
        res.status(200).json({ doesExist: true });
        return;
    }

    res.status(200).json({ doesExist: false });

}