// component representing the metadata of a post (date, title, group); as well as the options to update metadata.

import React, {FC} from "react"
import {post} from ".prisma/client";
import {useRouter} from "next/router";

interface PasteMetadataProps {
    fetchedPaste:post
    handleTitleUpdate: () => Promise<void>;
    setEditGroupMode: React.Dispatch<React.SetStateAction<boolean>>;

}

const PasteMetadata: FC<PasteMetadataProps> = ({fetchedPaste,handleTitleUpdate,setEditGroupMode}) => {
    return(
        <div className="space-y-2">
            <h1 className="text-4xl">Text metadata</h1>
            <h1>Date created: {fetchedPaste.createdAt.toLocaleString()} </h1>
            <h1>Title: {fetchedPaste.title ? fetchedPaste.title : "None"}</h1>
            <h1>Group: {fetchedPaste.group ? fetchedPaste.group : "None"}</h1>

            <div className="flex flex-col items-center space-y-3">
                <button className="bg-puddlePurple w-36 active:translate-y-1 " onClick={() => void handleTitleUpdate()}>Change Title</button>
                <button className="bg-puddlePurple w-36 active:translate-y-1 " onClick={() => void setEditGroupMode(true)}>Change Group</button>
            </div>
        </div>
    )
}

export default PasteMetadata
