import { FC } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { api } from "~/utils/api";
import { paste } from ".prisma/client";
import swal from "sweetalert2";
import ReusableButton from "~/components/reusableButton";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";


interface ctx {
    password: string,
    id: string,
}

const RawPasteDisplay: FC<ctx> = (ctx) => {
    const router = useRouter();
    const text = router.query.text;

    const { data: textData } = api.text.getPasteByIDPrivate.useQuery<paste[]>({
        textID: ctx.id
    });

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

    return (
        <>
            <main className="flex h-screen bg-deepPurple text-white min-h-screen overflow-y-auto">
                <div className="space-y-5 px-5">

                    <div className={"flex gap-x-3 mt-2 p-2"}>
                        <ReusableButton onClick={() => void router.push("/groupSelect")} text={"return"} isDangerous={true}/>
                        <ReusableButton onClick={handleCopy} text={"copy text"}/>
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
                destination: "/",
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
            id:context.query.id as string
        }
    })

    if(!paste){
        return {
            redirect: {
                destination: "/404",
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
            id: context.query.id
        }
    });

};

export default RawPasteDisplay;