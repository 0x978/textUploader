import {FC} from "react"

interface GroupDisplayProps {
  paginatedGroups:string[]
  groupMap:Map<string, number>
  redirect: (group:string) => void;
}

const GroupDisplay: FC<GroupDisplayProps> = ({ paginatedGroups, groupMap, redirect }) => {
  return (
    <div>
      {paginatedGroups.map((group, i) => {
        return (
          <div key={i} className="flex space-x-1.5" onClick={() => redirect(group)}>
            <div key={i} className=" text-lg relative flex flex-col justify-center items-center bg-puddlePurple w-96 h-16 rounded-lg my-5 py-2 shadow-lg cursor-pointer hover:scale-110 transition duration-300">
              <h1 className="m1-2 ">{group}</h1>
              <h1>count: {groupMap?.get(group)}</h1>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupDisplay