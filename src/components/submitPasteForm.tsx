import { type FC, type MouseEvent, useMemo, useState } from "react";
import { useRouter } from "next/router";
import ReusableButton from "~/components/reusableButton";
import { useSession } from "next-auth/react";
import ReusableReturnButton from "~/components/reusableReturnButton";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { api } from "~/utils/api";
import { paste } from ".prisma/client";

interface SubmitPasteFormProps {
    handleSubmit: (e: MouseEvent<HTMLButtonElement>, title: string, group: string, text: string) => void;
    handlePrivate: () => void;
    groups?: string[];
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

const SubmitPasteForm: FC<SubmitPasteFormProps> = ({ handleSubmit, handlePrivate, groups, user }) => {
    const [title, setTitle] = useState<string>("");
    const [group, setGroup] = useState<string>("none");
    const [text, setText] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [buttonBackground, setButtonBackground] = useState<"red" | "green">("red");
    const [groupSelectMode, setGroupSelectMode] = useState<boolean>(false);

    const { data: session } = useSession();

    const router = useRouter();

    if (user) {
        const { data } = api.user.getUserDefaultGroup.useQuery<paste[]>({
                userID: user.id
            },
            {
                onSuccess: (res) => {
                    if (res) {
                        setGroup(res.defaultPasteGroup)
                    }
                }
            });
    }

    const redirect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        void router.push({ pathname: "groupSelect" });
    };

    const togglePrivate = (e: MouseEvent<HTMLButtonElement>, toggledPrivate: boolean) => {
        e.preventDefault();
        handlePrivate();
        if (session) {
            setIsPrivate(prevState => !prevState);
            setButtonBackground(!toggledPrivate ? "green" : "red");
        }
    };

    function handleGroupSelect(group: string) {
        setGroup(group);
        setGroupSelectMode(false);
    }

    const mdOptions = useMemo(() => {
        return {
            spellChecker: false
        };
    }, []);


    return (
        <>
            {!groupSelectMode ?
                <div className="space-y-3 flex flex-col justify-center text-center items-center">
                    <h1>Paste Title</h1>
                    <input onChange={(e) => setTitle(e.target.value)} className="bg-puddlePurple w-full md:w-96 p-1" />
                    <h1>Paste group</h1>
                    {groups && <ReusableButton text={"select group"} onClick={() => setGroupSelectMode(true)} />}
                    <input value={group} onChange={(e) => setGroup(e.target.value)}
                           className="bg-puddlePurple w-full md:w-96 p-1" />
                    <h1>Paste Text</h1>
                    <SimpleMDE value={text} onChange={(value) => setText(value)} options={mdOptions} />

                    <div className={"flex flex-col space-y-3 text-center"}>
                        <ReusableButton text={"Set as private paste"} onClick={(e) => togglePrivate(e, isPrivate)}
                                        overrideWidth={"large"} overrideBackground={buttonBackground}
                                        overrideTextColour={"white"} />
                        <ReusableButton text={"Submit"}
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => handleSubmit(e, title, group, text)}
                                        overrideWidth={"large"} />
                        <ReusableReturnButton width={"large"} isDangerous={false} />
                    </div>
                </div>

                :
                <div>
                    <h1 className="font-bold text-2xl my-5">Select a group:</h1>
                    {groups?.map((group, index) => {
                        return (
                            <div key={index} className="flex space-x-1.5" onClick={() => handleGroupSelect(group)}>
                                <div key={index}
                                     className=" text-lg relative flex flex-col justify-center items-center bg-puddlePurple w-96 h-16 rounded-lg my-5 py-2 shadow-lg cursor-pointer hover:scale-110 transition duration-300">
                                    <h1 className="m1-2 ">{group}</h1>
                                </div>
                            </div>
                        );
                    })}
                    <ReusableReturnButton width={"large"} />
                </div>
            }
        </>
    );
};

export default SubmitPasteForm;