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
    const [isPrivate,setIsPrivate] = useState<boolean>(false)

    const { data: groups } = api.text.getAllGroupsByUserID.useQuery<string>({ // Gets user key
        userID: user.id
    });

    const { mutate: submitPaste } = api.text.submitPost.useMutation<paste>(
        {
            onSuccess: (data) => {
                void swal.fire({
                    title:"Paste successfully submitted!",
                    text: "Redirecting...",
                    icon:"success",
                    timer: 1300,
                    showConfirmButton: false,
                    background:"#433151",
                    color:"#9e75f0",
                }).then((_) => {
                    void router.push("paste?id=" + data.accessID);
                });
            }
        }
    );

    const togglePrivate = () =>  {
        if(!user){
            void swal.fire({
                title:"Not logged in!",
                text: "You must be logged in to do that",
                icon:"error",
                timer: 1300,
                toast: true,
                position: "top",
                showConfirmButton: false,
                background:"#433151",
                color:"#9e75f0",
            })
            return
        }
        void swal.fire({
            title: isPrivate ? "Set as public paste" : "Set as Private Paste",
            text: isPrivate ? "Paste is set to public" : "Paste is set to private",
            icon: isPrivate ? "success" : "error",
            timer: 1300,
            toast: true,
            position: "top",
            showConfirmButton: false,
            background:"#433151",
            color:"#9e75f0",
        })
        setIsPrivate(prevState => !prevState)
    }

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
            userID: user.id,
            isPrivate: isPrivate,
        });
    };

    return (
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple">
            <div className="m-auto">
                <h1 className="font-bold text-3xl my-5">Submit a new paste</h1>
                <SubmitPasteForm handleSubmit={handleSubmit} handlePrivate={togglePrivate} groups={([...new Set(groups?.map(r => r.group))])}/> {/*groups turned into set,then back to array to get unique elements in O(n) time */}
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