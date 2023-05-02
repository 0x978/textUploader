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
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const TextEdit: FC<textEditProps> = ({ id}) => {
    const router = useRouter()

    const [text, setText] = useState<string>("");
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
                void router.push("/" + id);
            });
        } });

    const { data: textData, isLoading } = api.text.getTextByID.useQuery<paste>({
        pasteAccessID: id
    }, {
        onSuccess: () => {
            if (textData?.text) {
                setText(textData.text);
            }
        }
    });

    const submitChanges = () => {
        if(textData){
            updateText({
                text: text,
                id: textData?.id
            });
        }
    };


    return (
        <main className={`flex h-screen text-center, bg-deepPurple text-superCoolEdgyPurple `}>

            {isLoading ? <h1>Loading...</h1> :

                <div className="mx-auto p-10 w-full ">

                    <div className="text-center text-3xl my-3">
                        <h1>Paste Edit:</h1>
                    </div>

                    <textarea className="w-full resize bg-puddlePurple min-h-[5rem] h-96" defaultValue={text}
                              onChange={(e) => setText(e.target.value)}></textarea>

                    <div className="text-center my-5">
                        <button
                            onClick={() => submitChanges()}
                            className={`bg-puddlePurple w-40 h-11 rounded-3xl hover:text-green-300 active:translate-y-1.5`}>Submit
                            Changes
                        </button>
                    </div>

                </div>

            }


        </main>
    );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) { // cant get middleware to work, so this will do for now
    const auth = await getServerAuthSession(ctx);

    if (!auth || auth.user.id !== ctx.query.pasteUser) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }

    const user = auth.user;

    const paste = await prisma.paste.findUnique({
        select:{
            userID: true,
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
            user,
            id: ctx.query.id
        }
    };
}


export default TextEdit;