import React, { FC, useState } from "react"
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Swal from 'sweetalert2'
import { GetServerSidePropsContext } from "next";
import { paste } from ".prisma/client";
import EditGroupSelect from "~/components/editGroupSelect";
import PasteMetadata from "~/components/pasteMetadata";



const Edit: FC = () => {
    const router = useRouter()
    const [editGroupMode, setEditGroupMode] = useState<boolean>(false)
    const { mutate: updateTitle } = api.text.updateTitle.useMutation()
    const { mutate: updateGroup } = api.text.updateGroup.useMutation()
    const [groups, setGroups] = useState<string[]>([])

    const id = router?.query?.id as string

    const { data: fetchedPaste } = api.text.getTextByID.useQuery({
        textID: id
    });

    const { data: textData, isLoading } = api.text.getAllText.useQuery<paste[]>(undefined, {
        onSuccess(res: paste[]) {
            const uniqueGroup = new Map<string, number>();
            res.forEach(r => {
                const count = uniqueGroup.get(r.group);
                uniqueGroup.set(r.group, (count ? count + 1 : 1));
            });
            setGroups(Array.from(uniqueGroup.keys()))
        }
    })


    const handleTitleUpdate = async (): Promise<void> => {
        const { value: newTitle } = await Swal.fire<string>({
            title: 'Enter a new title',
            icon: "question",
            input: 'text',
        })

        if (newTitle) {
            updateTitle({
                id: id,
                title: newTitle,
            })
            fetchedPaste!.title = newTitle
        }
    }

    const handleNewGroup = async () => {
        const { value: newGroup } = await Swal.fire<string>({
            title: 'Enter a new group',
            icon: "question",
            input: 'text',
        })

        if (newGroup) {
            handleGroupChange(newGroup)
            fetchedPaste!.group = newGroup
        }
    }

    const handleGroupChange = (newGroup: string) => {
        updateGroup({
            id: id,
            group: newGroup,
        })
        fetchedPaste!.group = newGroup
        setEditGroupMode(false)
    }


    return (
        <main className={`flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple`}>
            <div className="m-auto">
                <div>
                    {fetchedPaste ? ( // if successfully fetched current paste properties:
                        <div>
                            {editGroupMode ? // if user is currently in group edit mode, show group edit GUI.
                                <div>
                                    <EditGroupSelect groups={groups} fetchedPaste={fetchedPaste} handleNewGroup={handleNewGroup} handleGroupChange={handleGroupChange} />
                                    <button className="bg-puddlePurple w-24 hover:text-red-400 active:translate-y-1" onClick={() => setEditGroupMode(false)}>Return</button>
                                </div>
                                : // if user is not currently in group edit mode, show the pastes' metadata
                                <div>
                                    <PasteMetadata fetchedPaste={fetchedPaste} handleTitleUpdate={handleTitleUpdate} setEditGroupMode={setEditGroupMode} />
                                    <button className="bg-puddlePurple w-24 hover:text-red-400 my-3 active:translate-y-1" onClick={() => void router.push({ pathname: "pasteSelect", query: { group: fetchedPaste.group } }, "home")}>Return</button>
                                </div>
                            }
                        </div>
                    ) : // If not successfully fetched current paste properties; probably loading.
                        <h1>Loading</h1>}
                </div>
            </div>
        </main>
    )
}



export default Edit