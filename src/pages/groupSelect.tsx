import {type FC, useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { paste } from ".prisma/client";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { getServerAuthSession } from "~/server/auth";
import GroupDisplay from "~/components/groupDisplay";
import ReusableButton from "~/components/reusableButton";
import swal from "sweetalert2"
import Swal from "sweetalert2";
interface GroupSelectProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const GroupSelect: FC<GroupSelectProps> = ({ user }) => {

    const router = useRouter();

    const [paginatedGroups, setPaginatedGroups] = useState<string[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [groupMap, setGroupMap] = useState<Map<string, number>>(new Map<string, number>);
    const [pageSize,setPageSize] = useState<number>( 0)
    const [editMode,setEditMode] = useState<boolean>(false)
    const [minPageSize, setMinPageSize] = useState<number>(0);
    const { mutate: updateGroupName } = api.text.updateGroupName.useMutation();

    const redirect = (group: string) => { // redirects user to paste selection when a group is selected.
        void router.push({
            pathname: "pasteSelect",
            query: {
                group: group
            }
        });
    };

    const {isLoading } = api.text.getAllText.useQuery<paste[]>({ // fetches all texts, parsing their groups to display each available group. This is not sustainable
        userID: user.id
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
            setPaginatedGroups(uniqueKeys?.slice(minPageSize, pageSize));
        }
    });

    useEffect(() => {
        setPageSize( window.innerHeight >= 750 ? 5 : 4) // Display less elements if on mobile devices
        setPaginatedGroups(groups?.slice(minPageSize, minPageSize + pageSize));
    }, [minPageSize]);

    async function defineClickAction(group:string){
        if(editMode){
            const { value: newGroup } = await Swal.fire<string>({
                title:`Enter a new name for the group "${group}"`,
                icon: "question",
                input: "text",
                background:"#433151",
                color:"#9e75f0",
            });
            if(newGroup){
                updateGroupName({
                    id:user.id,
                    oldGroup:group,
                    newGroup:newGroup,
                })
                void swal.fire({
                    title: "Success",
                    text: "Group name changed, please refresh to see results.",
                    icon: "success" ,
                    timer: 1300,
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    background:"#433151",
                    color:"#9e75f0",
                })
                setEditMode(false)
                setPaginatedGroups(prevState => prevState.map(g => g === group ? g = newGroup : g))
            }
        }
        else{
            redirect(group)
        }
    }

    function handleEditSwap(){
        setEditMode(prevState => !prevState)
        void swal.fire({
            title:editMode ? "Set to selection mode" : "Set to edit mode",
            text: editMode ? "Selection mode enabled" : "Edit mode enabled",
            icon: "warning" ,
            timer: 1300,
            toast: true,
            position: "top",
            showConfirmButton: false,
            background:"#433151",
            color:"#9e75f0",
        })

    }


    return (
        <>
            <main className={`flex h-screen text-center bg-deepPurple ${editMode ? "text-green-400" : "text-superCoolEdgyPurple"}`}>
                <div className="m-auto">

                    <h1 className="font-bold text-3xl my-5 ">Select a group</h1>
                    <ReusableButton text={"Create a New Paste"} overrideWidth={"large"} onClick={() => void router.push("submit")}/>


                    {isLoading ? // if fetching categories, display as such.
                        <h1> Loading categories... </h1>
                        : // once categories are fetched, check if the user has any pastes
                        <div>
                            {paginatedGroups.length === 0 ? // if user has no pastes, display as such
                                <h1 className="my-5">You have no pastes</h1>
                                : // If user does have pastes, handle this in components/groupDisplay.tsx
                                <GroupDisplay paginatedGroups={paginatedGroups} groupMap={groupMap}
                                              redirect={defineClickAction} />
                            }
                        </div>
                    }


                    <div
                        className="my-5 space-x-10 "> {/* Div responsible for increment, decrement buttons for pagination */}
                        <button className="w-40 bg-puddlePurple p-2 hover:-translate-y-1 transition duration-300"
                                onClick={() => {
                                    if ((minPageSize - pageSize >= 0)) setMinPageSize(prevState => prevState - pageSize);
                                }}>Decrement
                        </button>

                        <button className="w-40 bg-puddlePurple p-2  hover:-translate-y-1 transition duration-300"
                                onClick={() => {
                                    if ((minPageSize + pageSize < groups.length)) setMinPageSize(prevState => prevState + pageSize);
                                }}>Increment
                        </button>
                    </div>

                    <div className={"space-x-10 my-3"}>
                        <ReusableButton text={"User Settings"} onClick={() => void router.push("/settings")} />
                        <ReusableButton text={"ShareX Steps"}  onClick={() => void router.push("/shareXInstructions")} />
                    </div>

                    <ReusableButton isDangerous={editMode} text={"Rename group"} onClick={() => handleEditSwap()} />

                </div>
            </main>
        </>
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


export default GroupSelect;