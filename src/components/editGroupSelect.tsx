// This component represents the user interface for changing the group that a paste belongs to.

import type { FC } from "react";
import type { paste } from ".prisma/client";

interface EditGroupSelectProps {
    groups: string[],
    fetchedPaste?: paste,
    handleNewGroup?: () => Promise<void>;
    handleGroupChange: (newGroup: string) => void;

}

const EditGroupSelect: FC<EditGroupSelectProps> = ({ groups, fetchedPaste, handleNewGroup, handleGroupChange }) => {
    console.log(groups)
    return (
        <div className="space-y-2">
            <h1 className="text-4xl my-4">Set group</h1>

            {handleNewGroup && <button
              className="bg-puddlePurple w-44 h-10 hover:text-green-400 hover:scale-110 transition duration-300 active:translate-y-1"
              onClick={() => void handleNewGroup()}>Create new Group</button>}

            {groups.filter(q => q !== fetchedPaste?.group).map((group, i) => { // map through each group, passed as props. Filtered as we don't want the user to be able to select the group that the paste already belongs to.
                    return (
                        <div key={i} className="flex space-x-1.5" onClick={() => void handleGroupChange(group)}>
                            <div key={i} className=" text-lg relative flex flex-col justify-center items-center bg-puddlePurple w-96
                                    h-16 rounded-lg my-5 py-2 shadow-lg cursor-pointer hover:scale-110 transition duration-300">
                                <h1 className="m1-2 ">{group}</h1>
                            </div>
                        </div>
                    );
            })}
        </div>
    );
};

export default EditGroupSelect;
