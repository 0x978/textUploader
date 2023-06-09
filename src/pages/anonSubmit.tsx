import type{ FC, MouseEvent } from "react";
import SubmitPasteForm from "~/components/submitPasteForm";
import { api } from "~/utils/api";
import { type paste } from ".prisma/client";
import { useRouter } from "next/router";
import swal from "sweetalert2";


const AnonSubmit: FC = () => {
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
                    void router.push("/" + data.accessID);
                });
            }
        }
    );

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>, title: string, group: string, text: string) => {
        e.preventDefault();
        let parsedGroup: string = group;
        if (parsedGroup.length === 0) {
            parsedGroup = "none";
        }

        submitPaste({
            title: title,
            group: parsedGroup,
            text: text,
            userID: "Anonymous",
            isPrivate:false,
        });
    };

    const togglePrivate = () =>  {
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
    }

    return (
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple">
            <div className="m-auto">
                <h1 className="font-bold text-3xl my-5">Submit a new paste Anonymously</h1>
                <h1 className="font-bold text-xl my-5">Please note you are not logged in. If you lose the URL to your
                    paste, you will not be able to access it</h1>
                <h1 className="font-bold text-xl my-5">To save pastes, <span
                    className={"cursor-pointer text-green-400 underline"} onClick={() => void router.push("/")}>Login Now</span>
                </h1>
                <SubmitPasteForm handleSubmit={handleSubmit} handlePrivate={togglePrivate}/>
            </div>
        </main>
    );
};

export default AnonSubmit;