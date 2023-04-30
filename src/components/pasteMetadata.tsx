// component representing the metadata of a paste (date, title, group); as well as the options to update metadata.

import React, {type FC} from "react"
import {type paste} from ".prisma/client";
import {useRouter} from "next/router";
import ReusableButton from "~/components/reusableButton";

interface PasteMetadataProps {
    fetchedPaste:paste
    handleTitleUpdate: () => Promise<void>;
    setEditGroupMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasteMetadata: FC<PasteMetadataProps> = ({fetchedPaste,handleTitleUpdate,setEditGroupMode}) => {
    const router = useRouter()

    function handleEditText(){
        void router.push({
            pathname:"/textEdit",
            query:{
                id:fetchedPaste.accessID,
                pasteUser: fetchedPaste.userID
            }
        })
    }

    return(
        <div className="space-y-2">
            <h1 className="text-4xl">Text metadata</h1>
            <h1>Date created: {fetchedPaste.createdAt.toLocaleString()} </h1>
            <h1>Title: {fetchedPaste.title ? fetchedPaste.title : "None"}</h1>
            <h1>Group: {fetchedPaste.group ? fetchedPaste.group : "None"}</h1>

            <div className="flex flex-col items-center space-y-3">
                <ReusableButton text={"Change Title"} onClick={() => handleTitleUpdate()} overrideWidth={"large"} />
                <ReusableButton text={"Change Group"} onClick={() => setEditGroupMode(true)} overrideWidth={"large"}/>
                <ReusableButton text={"Edit text"} onClick={() => handleEditText()} overrideWidth={"large"}/>
                <ReusableButton text={"Custom URL"} overrideWidth={"large"} onClick={() => void router.push({pathname:"/customURL",query:{id:fetchedPaste.id,URL:fetchedPaste.accessID}})}/>
            </div>
        </div>
    )
}

export default PasteMetadata
