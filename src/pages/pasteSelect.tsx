import { type FC, useEffect, useState } from "react";
import type { GetServerSidePropsContext } from "next";
import { api } from "~/utils/api";
import type { paste } from ".prisma/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { getServerAuthSession } from "~/server/auth";
import Swal from "sweetalert2";
import ReusableButton from "~/components/reusableButton";
import EditGroupSelect from "~/components/editGroupSelect";

interface ctx {
    group: string,
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const PasteSelect: FC<ctx> = (ctx) => {
    const router = useRouter();
    const [min, setMin] = useState<number>(0);
    const [textArr, setTextArr] = useState<paste[]>([]);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [style, setStyle] = useState<string>("text-superCoolEdgyPurple");
    const [groupChanges,setGroupChanges] = useState<string[]>([])
    const [delText,setDelText] = useState<string>("Delete Mode?")
    const [massGroup,setMassGroup] = useState<boolean>(false)
    const [submitNewGroups,setSubmitNewGroups] = useState<boolean>(false)

    const [paginatedGroups, setPaginatedGroups] = useState<string[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [groupMap, setGroupMap] = useState<Map<string, number>>(new Map<string, number>);
    const [minPageSize, setMinPageSize] = useState<number>(0);
    const { mutate: updateGroup } = api.text.updateGroup.useMutation();

    api.text.getAllText.useQuery<paste[]>({ // fetches all texts, parsing their groups to display each available group. This is not sustainable
        userID: ctx.user.id
    }, {
        onSuccess(res: paste[]) {
            const uniqueGroup = new Map<string, number>();
            res.forEach(r => {
                const count = uniqueGroup.get(r.group);
                uniqueGroup.set(r.group, (count ? count + 1 : 1));
            });
            const uniqueKeys = Array.from(uniqueGroup.keys());
            setGroups(uniqueKeys);
            setGroupMap(uniqueGroup);
            setPaginatedGroups(uniqueKeys?.slice(minPageSize, 5));
        }
    });

    const { data: textData } = api.text.getAllTextByGroup.useQuery<paste[]>({
        group: ctx.group,
        userID: ctx.user.id
    });

    const { mutate: deleteItem } = api.text.deleteText.useMutation({
        onSuccess(deletedPost) {
            void Swal.fire({
                title:"Post successfully Deleted",
                position:"top",
                toast:true,
                icon:"success",
                timer: 1500,
                showConfirmButton: false,
                background:"#433151",
                color:"#9e75f0",
            })
            setTextArr(prevState => prevState.filter((q) => q.id !== deletedPost.id));
        }
    });

    useEffect(() => {
        if (textData) {
            setTextArr(textData?.slice(min, min + 5));
        }
    }, [textData, min]);

    const handleClick = (text: string, id: string, accessID:string) => {
        if (deleteMode) {
            void Swal.fire({
                title: 'Delete Paste?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirm Deletion',
                background:"#433151",
                color:"#9e75f0",
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteItem({ id: id });
                    if (textArr.length === 1) {
                        setMin(min === 0 ? prevState => prevState + 5 : prevState => prevState - 5);
                    }
                }
            })
        } else if (editMode) {
            void router.push({
                pathname: "edit",
                query: {
                    id:id,
                    accessID: accessID,
                }
            });
        }
        else if(massGroup){
            void Swal.fire({
                title:"Post successfully added to mass group change",
                position:"top",
                toast:true,
                icon:"success",
                timer: 1500,
                showConfirmButton: false,
                background:"#433151",
                color:"#9e75f0",
            })
            setGroupChanges([...groupChanges,id])
        }
        else {
            void router.push({
                pathname: "/"+accessID});
        }
    };

    const handleChange = (change: string) => { // this sucks but the way tailwind wants to work on Vercel has forced my hand
        switch (change) {
            case "del":
                if (deleteMode||massGroup) {
                    setStyle("text-superCoolEdgyPurple");
                    setDeleteMode(false);
                    setEditMode(false)
                    setMassGroup(false)
                    setDelText("Delete mode?")
                    return;
                }
                if(editMode){
                    setMassGroup(true)
                    setEditMode(false)
                    setStyle("text-orange-300");
                }
                else {
                    setStyle("text-red-400");
                    setDeleteMode(true);
                    setEditMode(false)
                    setMassGroup(false)
                }
                break;
            case "edit":
                if (editMode) {
                    setStyle("text-superCoolEdgyPurple");
                    setEditMode(false);
                    setDelText("Delete Mode?")
                } else {
                    setStyle("text-green-400");
                    setEditMode(true);
                    setDeleteMode(false)
                    setDelText("Mass Edit Group")
                }
                break;
        }
    };

    function handleGroup(newGroup: string){
        groupChanges.forEach(id => {
            updateGroup({
                id: id,
                group: newGroup
            });
        })
        void Swal.fire({
            title:"Successfully Changed groups",
            text:"Redirecting...",
            icon:"success",
            timer: 1000,
            showConfirmButton: false,
            background:"#433151",
            color:"#9e75f0",
        }).then(_ =>{
            void router.push("/groupSelect")
        })

    }

    return <>
        <Head>
            <title>ShareX Text</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={`flex h-screen text-center bg-deepPurple ${style}`}>
            <div className="m-auto">
                <h1 className="font-bold text-3xl my-5 ">Texts:</h1>
                <div className="">
                    {
                        textData && !submitNewGroups ? (
                                <div className="">
                                    <div className="h-[53vh]">
                                        {textArr.map((paste, i) => { // Texts display
                                            return (
                                                <div key={i} className="flex space-x-1.5 ">
                                                    <div onClick={() => handleClick(textArr[i]!.text,textArr[i]!.id, textArr[i]!.accessID)}
                                                         key={i} className="relative flex flex-col justify-center items-center bg-puddlePurple w-96
                                    h-16 rounded-lg my-5 py-2 shadow-lg cursor-pointer hover:scale-110 transition duration-300">
                                                        <h1> {/*If text has title, use that, else: If length of text is over 30, put first 30 chars then "...", else put full string */}
                                                            {textArr[i]?.title || (textArr[i]!.text?.length > 30 ? `${textArr[i]?.text?.substring(0, 30) as string} ... ` : textArr[i]?.text)}
                                                        </h1>

                                                        <h1 className="my-2">{new Date(textArr[i]!.createdAt).toLocaleString()}</h1>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="my-5 space-x-10 ">
                                        <button
                                            className="w-40 bg-puddlePurple p-2 hover:-translate-y-1 transition duration-300"
                                            onClick={() => {
                                                if ((min - 5 >= 0)) setMin(prevState => prevState - 5);
                                            }}>Decrement
                                        </button>
                                        <button
                                            className="w-40 bg-puddlePurple p-2  hover:-translate-y-1 transition duration-300"
                                            onClick={() => {
                                                if ((min + 5 < textData.length)) setMin(prevState => prevState + 5);
                                            }}>Increment
                                        </button>
                                    </div>

                                    <div className="my-5 space-x-10 ">

                                        <ReusableButton text={delText} onClick={() => handleChange("del")} overrideHoverTextColour={"red"}/>
                                        <ReusableButton text={"Edit Mode?"} onClick={() => handleChange("edit")}/>

                                    </div>

                                    <div className={"space-x-10"}>
                                        <button className={`bg-puddlePurple p-2 w-40 hover:text-orange-300`}
                                                onClick={() => void router.push({ pathname: "groupSelect" }, "groupSelect")}>Return
                                        </button>

                                        {massGroup && <ReusableButton text={"apply changes"} onClick={() => setSubmitNewGroups(true)} />}
                                    </div>


                                </div>
                            )
                            :
                            submitNewGroups ?
                                <EditGroupSelect groups={groups} handleGroupChange={handleGroup}/>
                                :
                                <h1>Loading</h1>
                    }
                </div>
            </div>
        </main>
    </>;
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
    return ({
        props: {
            group: ctx.query.group,
            user
        }
    });

}


export default PasteSelect;