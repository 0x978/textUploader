import { FC, MouseEvent, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { api } from "~/utils/api";
import { paste } from ".prisma/client";
import { getServerAuthSession } from "~/server/auth";
import SubmitPasteForm from "~/components/submitPasteForm";
import swal from "sweetalert2";

interface SubmitProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const Submit: FC<SubmitProps> = ({ user }) => {
    const router = useRouter();

    const { mutate: submitPaste } = api.text.submitPost.useMutation<paste>(
        {
            onSuccess: (data) => {
                void swal.fire({
                    title:"Post successfully submitted!",
                    text: "Redirecting...",
                    icon:"success",
                    timer: 1300,
                    showConfirmButton: false,
                    background:"#433151",
                    color:"#9e75f0",
                }).then((_) => {
                    void router.push("rawPasteDisplay?id=" + data.id);
                });
            }
        }
    );

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>,title:string,group:string,text:string) => {
        e.preventDefault();
        let parsedGroup: string = group;
        if (parsedGroup.length === 0) {
            parsedGroup = "none";
        }

        submitPaste({
            title: title,
            group: parsedGroup,
            text: text,
            userID: user.id
        });
    };

    return (
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple">
            <div className="m-auto">
                <h1 className="font-bold text-3xl my-5">Submit a new paste</h1>
                <SubmitPasteForm handleSubmit={handleSubmit}/>
            </div>
        </main>
    );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) { // cant get middleware to work, so this will do for now
    const auth = await getServerAuthSession(ctx);

    if (!auth) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }

    const user = auth.user;

    return {
        props: {
            user
        }
    };
}


export default Submit;