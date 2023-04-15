import { FC, MouseEvent, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { paste } from ".prisma/client";
import ReusableButton from "~/components/reusableButton";
import { useSession } from "next-auth/react";
import swal from "sweetalert2";

interface SubmitPasteFormProps {
    handleSubmit: (e: MouseEvent<HTMLButtonElement>,title:string,group:string,text:string) => void;
    handlePrivate: () => void;
}

const SubmitPasteForm: FC<SubmitPasteFormProps> = ({handleSubmit,handlePrivate}) => {
    const [title, setTitle] = useState<string>("");
    const [group, setGroup] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [isPrivate,setIsPrivate] = useState<boolean>(false)
    const [buttonBackground,setButtonBackground] = useState<string>("bg-red-600")
    const { data: session } = useSession()

    const router = useRouter();


    const redirect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        void router.push({ pathname: "groupSelect" });
    };

    const togglePrivate = (e: MouseEvent<HTMLButtonElement>,toggledPrivate:boolean) =>  {
        e.preventDefault();
        handlePrivate()
        if(session){
            setIsPrivate(prevState => !prevState)
            setButtonBackground(!toggledPrivate ? "bg-green-500" : "bg-red-600")
        }
    }


    return(
        <>
                <form className="space-y-3 flex flex-col justify-center text-center items-center">
                    <h1>Paste Title</h1>
                    <input onChange={(e) => setTitle(e.target.value)} className="bg-puddlePurple w-96 p-1" />
                    <h1>Paste group</h1>
                    <input onChange={(e) => setGroup(e.target.value)} className="bg-puddlePurple w-96 p-1" />
                    <h1>Paste Text</h1>
                    <textarea onChange={(e) => setText(e.target.value)}
                              className="bg-puddlePurple resize min-h-[7rem] w-96" />

                    <div className={"flex flex-col space-y-3  text-center"}>
                        <ReusableButton text={"Set as private paste"} onClick={(e) => togglePrivate(e,isPrivate)} overrideWidth={48} overrideBackground={buttonBackground} overrideTextColour={"white"} />
                        <ReusableButton text={"Submit"} onClick={(e:MouseEvent<HTMLButtonElement>) => handleSubmit(e,title,group,text)} overrideWidth={48} />
                        <ReusableButton text={"Return"} onClick={(e) => redirect(e)} overrideWidth={48} isDangerous={true} />
                    </div>
                </form>
            </>
    )
}

export default SubmitPasteForm