import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import swal from "sweetalert2";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { id } = req.query;

    if (!id || Array.isArray(id)) {
        res.status(403).send({
            error: "No ID given"
        });
        return;
    }

    // checking if requested URL ID is disallowed
    const disallowedURLs:string[] = ["anonSubmit","customURL","edit","FAQ","groupSelect","pasteSelect","settings","shareXInstructions","submit","textEdit","unauthorisedPasteAccess","404"]
    for(let i = 0; i < disallowedURLs.length;i++){
        const curr = disallowedURLs[i]
        if(curr && id.localeCompare(curr,"en",{sensitivity:`base`}) === 0){
            res.status(200).json({ doesExist: true });
            return
        }
    }

    const paste = await prisma.paste.findUnique({
        where: {
            accessID: id
        }
    });

    if (paste) {
        res.status(200).json({ doesExist: true });
        return;
    }

    res.status(200).json({ doesExist: false });

}