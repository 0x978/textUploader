import type { FC } from "react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";
import { api } from "~/utils/api";
import type { paste } from ".prisma/client";
import swal from "sweetalert2";
import ReusableButton from "~/components/reusableButton";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { useEffect, useState } from "react";


interface ctx {
    password: string,
    id: string,
    isUsersPaste:boolean,
}

const Id: FC<ctx> = (ctx) => {
    const router = useRouter();
    const [updated,setUpdated] = useState<boolean>(false)

    const { data: textData } = api.text.getPasteByIDPrivate.useQuery<paste[]>({
        pasteAccessID: ctx.id
    });

    const { mutate: updateViews } = api.text.updateViews.useMutation();


    function handleCopy() {
        if (textData?.text) {
            void navigator.clipboard.writeText(textData.text);
            void swal.fire({
                text: "Copied!",
                toast: true,
                position: "top",
                timer: 1000,
                icon:"success",
                showConfirmButton: false,
                background:"#433151",
                color:"#9e75f0",
            });
        }
    }

    useEffect(() => {
        if(textData && !updated){
            const newViews = textData?.views +1
            setUpdated(true)
            updateViews({
                id: ctx.id,
                updatedViewsCount: newViews
            })
        }
    },[textData])

    return (
        <>
            <main className="flex h-screen bg-deepPurple text-white min-h-screen overflow-y-auto">
                <div className="space-y-5 px-5">

                    <div className={"flex gap-x-3 mt-2 p-2"}>
                        <ReusableButton onClick={() => void router.push(ctx.isUsersPaste ? "/pasteSelect?group="+textData?.group : "/")} text={"return"} isDangerous={true}/>
                        <ReusableButton onClick={handleCopy} text={"copy text"}/>
                        <h1 className={"my-2"}>Views: {textData?.views}</h1>
                    </div>

                    <div className={"pt-5 font-sans"}>
                        <pre className="whitespace-pre-wrap">{textData?.text}</pre>
                    </div>



                </div>
            </main>

        </>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const auth = await getServerAuthSession(context);

    if(!context.query.id){
        return {
            redirect: {
                destination: "/index",
                permanent: false
            }
        };
    }

    const paste = await prisma.paste.findUnique({
        select:{
            userID: true,
            isPrivate: true,
        },
        where:{
            accessID:context.query.id as string
        }
    })

    if(!paste){
        return {
            redirect: {
                destination: "/notFound",
                permanent: false
            }
        };
    }

    if(!auth && paste.isPrivate || auth && paste.isPrivate && (paste.userID !== auth.user.id)){
        return {
            redirect: {
                destination: "/unauthorisedPasteAccess",
                permanent: false
            }
        };
    }

    return ({
        props: {
            id: context.query.id,
            isUsersPaste: auth?.user.id === paste.userID
        }
    });

};

export default Id;