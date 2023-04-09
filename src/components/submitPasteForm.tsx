import { FC, MouseEvent, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { paste } from ".prisma/client";

interface SubmitPasteFormProps {
    handleSubmit: (e: MouseEvent<HTMLButtonElement>,title:string,group:string,text:string) => void;
}

const SubmitPasteForm: FC<SubmitPasteFormProps> = ({handleSubmit}) => {
    const [title, setTitle] = useState<string>("");
    const [group, setGroup] = useState<string>("");
    const [text, setText] = useState<string>("");
    const router = useRouter();


    const redirect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        void router.push({ pathname: "groupSelect" });
    };



    return(
        <>
                <form className="space-y-3 ">
                    <h1>Paste Title</h1>
                    <input onChange={(e) => setTitle(e.target.value)} className="bg-puddlePurple w-96 p-1" />
                    <h1>Paste group</h1>
                    <input onChange={(e) => setGroup(e.target.value)} className="bg-puddlePurple w-96 p-1" />
                    <h1>Paste Text</h1>
                    <textarea onChange={(e) => setText(e.target.value)}
                              className="bg-puddlePurple resize min-h-[7rem] w-96" />
                    <div>
                        <button onClick={(e) => handleSubmit(e,title,group,text)}
                                className="my-5 bg-puddlePurple w-44 hover:text-green-300 active:translate-y-1 active:text-green-500 py-2 px-4">Submit
                        </button>
                    </div>
                    <button onClick={(e) => redirect(e)}
                            className="bg-puddlePurple w-44 hover:text-red-300 active:translate-y-1 active:text-red-500 py-2 px-4">Return
                    </button>
                </form>
            </>
    )
}

export default SubmitPasteForm