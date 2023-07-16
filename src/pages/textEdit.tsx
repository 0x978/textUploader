import { type FC, useState } from "react";
import { api } from "~/utils/api";
import type { paste } from ".prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import swal from "sweetalert2";
import { useRouter } from "next/router";
import { prisma } from "~/server/db";

interface textEditProps {
    id: string,
    textData:string,
    accessID:string,
}

const TextEdit: FC<textEditProps> = ({ id,textData,accessID}) => {
    const router = useRouter()

    const [text, setText] = useState<string>(textData);

    const { mutate: updateText } = api.text.updateText.useMutation({ onSuccess: (_) => {
            void swal.fire({
                title:"Post successfully Edited!",
                text: "Redirecting...",
                icon:"success",
                timer: 1100,
                showConfirmButton: false,
                background:"#433151",
                color:"#9e75f0",
            }).then((_) => {
                void router.push("/" + accessID);
            });
        } });

    const submitChanges = () => {
        if(textData){
            updateText({
                text: text,
                id: id,
                date: new Date()
            });
        }
    };


    return (
        <main className={`flex h-screen text-center, bg-deepPurple text-superCoolEdgyPurple `}>

                <div className="mx-auto p-10 w-full ">

                    <div className="text-center text-3xl my-3">
                        <h1>Paste Edit:</h1>
                    </div>

                    <textarea className="w-full resize bg-puddlePurple min-h-[5rem] h-96" value={text}
                              onChange={(e) => setText(e.target.value)}></textarea>

                    <div className="text-center my-5">
                        <button
                            onClick={() => submitChanges()}
                            className={`bg-puddlePurple w-40 h-11 rounded-3xl hover:text-green-300 active:translate-y-1.5`}>Submit
                            Changes
                        </button>
                    </div>
                </div>
        </main>
    );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) { // cant get middleware to work, so this will do for now
    const auth = await getServerAuthSession(ctx);

    const paste = await prisma.paste.findUnique({
        select:{
            userID: true,
            text: true,
            id:true,
        },
        where:{
            accessID:ctx.query.id as string
        }
    })

    if(!paste || !auth || (paste.userID !== auth.user.id)){
        return {
            redirect: {
                destination: "/unauthorisedPasteAccess",
                permanent: false
            }
        };
    }

    return {
        props: {
            id: paste.id,
            accessID:ctx.query.id,
            textData:paste.text,
        }
    };
}


export default TextEdit;