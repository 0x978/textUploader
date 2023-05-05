import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await prisma.paste.count().then(r => {
        res.status(200).json({ count: r });
    }).catch(_ => res.status(401).send({
        error: "Unknown error"
    }));
}