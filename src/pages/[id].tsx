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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Swal from "sweetalert2";


interface ctx {
    password: string,
    accessID: string,
    isUsersPaste:boolean,
    postID: string|null,
    visitorID: string|undefined,
}

const Id: FC<ctx> = (ctx) => {
    const router = useRouter();
    const [updated,setUpdated] = useState<boolean>(false)

    const { data: textData } = api.text.getPasteByIDPrivate.useQuery<paste[]>({
        pasteAccessID: ctx.accessID
    });

    const { mutate: reportPost } = api.text.reportPost.useMutation();

    const { mutate: updateViews } = api.text.updateViews.useMutation();

    const { mutate: deleteItem } = api.text.deleteText.useMutation({
        onSuccess(deletedPost) {
            void Swal.fire({
                title: "Post successfully Deleted",
                position: "top",
                toast: true,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                background: "#433151",
                color: "#9e75f0"
            });
            void router.push("/")
        }
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

    useEffect(() => {
        if(textData && !updated){
            const newViews = textData?.views +1
            setUpdated(true)
            updateViews({
                id: ctx.accessID,
                updatedViewsCount: newViews
            })
        }
    },[textData])

    async function handlePasteReport(){
        const { value: reportReason } = await Swal.fire<string>({
            text: `You are reporting post ID: ${ctx.accessID}`,
            title:`Please provide a short description for the reason for the report.`,
            icon: "question",
            input: "text",
            background:"#433151",
            color:"#9e75f0",
        });
        if(reportReason){
            ctx.visitorID ? reportPost({postAccessID:ctx.accessID,reason:reportReason,reportingUserID:ctx?.visitorID}) :  reportPost({postAccessID:ctx.accessID,reason:reportReason})
            void swal.fire({
                title: "Successfully Reported Post",
                text: "We will review the report as soon as possible.",
                icon:"success",
                showConfirmButton: true,
                background:"#433151",
                color:"#9e75f0",
            });
        }
        else{
            void swal.fire({
                title: "Failed to report post!",
                text: "Please provide a report reason.",
                icon:"error",
                showConfirmButton: true,
                background:"#433151",
                color:"#9e75f0",
            });
        }

    }
    return (
        <>
            <main className="flex flex-col h-screen bg-deepPurple text-white">
                <div className="px-5 pt-2">
                    <div className="flex gap-x-3 flex-wrap">
                        <ReusableButton onClick={() => void router.push(ctx?.isUsersPaste && textData?.group ? `/pasteSelect?group=${textData?.group}` : `/`)} text="return" isDangerous={true} />
                        <ReusableButton onClick={handleCopy} text="copy text" />
                        {ctx.isUsersPaste && <ReusableButton text={"Edit Post"} onClick={() =>
                            void router.push(`/textEdit?id=${ctx.accessID}`)} />}

                        {ctx.isUsersPaste ? <ReusableButton text={"Delete Post"} isDangerous={true} onClick={() => {
                            if(ctx.postID !== null){
                                deleteItem({id:ctx.postID});
                            }}}
                        />
                            :
                            <ReusableButton text={"Report Post"} isDangerous={true} onClick={() => {
                                void handlePasteReport()
                            }} />
                        }
                        <h1 className="my-2">Views: {textData?.views}</h1>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto break-words">
                    <div className="p-5 font-sans">
                        {textData?.text && <ReactMarkdown remarkPlugins={[remarkGfm]} className={`prose prose-invert`}>
                            {textData?.text}
                        </ReactMarkdown>
                        }
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
            id:true,
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
            accessID: context.query.id,
            isUsersPaste: auth?.user.id === paste.userID,
            postID: auth?.user.id === paste.userID ? paste.id : null,
            visitorID: auth?.user.id || null
        }
    });

};

export default Id;