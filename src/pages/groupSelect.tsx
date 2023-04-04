import { FC, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { paste } from ".prisma/client";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { getServerAuthSession } from "~/server/auth";
import GroupDisplay from "~/components/groupDisplay";

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
    const pageSize = 5;
    const [minPageSize, setMinPageSize] = useState<number>(0);

    const redirect = (group: string) => { // redirects user to paste selection when a group is selected.
        void router.push({
            pathname: "pasteSelect",
            query: {
                group: group
            }
        });
    };

    const { data: textData, isLoading } = api.text.getAllText.useQuery<paste[]>({ // fetches all texts, parsing their groups to display each available group. This is not sustainable
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
            setPaginatedGroups(uniqueKeys?.slice(minPageSize, 5));
        }
    });

    useEffect(() => {
        setPaginatedGroups(groups?.slice(minPageSize, minPageSize + pageSize));
    }, [minPageSize]);


    return (
        <>
            <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple">
                <div className="m-auto">

                    <h1 className="font-bold text-3xl my-5 ">Select a category</h1>
                    <button onClick={() => void router.push({ pathname: "submit" }, "submit")}
                            className="bg-puddlePurple hover:text-green-300 active:translate-y-1 active:text-green-500 py-2 px-4">
                        Create new paste
                    </button>

                    {isLoading ? // if fetching categories, display as such.
                        <h1> Loading categories... </h1>
                        : // once categories are fetched, check if the user has any pastes
                        <div>
                            {paginatedGroups.length === 0 ? // if user has no pastes, display as such
                                <h1 className="my-5">You have no pastes</h1>
                                : // If user does have pastes, handle this in components/groupDisplay.tsx
                                <GroupDisplay paginatedGroups={paginatedGroups} groupMap={groupMap}
                                              redirect={redirect} />
                            }
                        </div>
                    }


                    <div
                        className="my-5 space-x-10 "> {/* Div responsible for increment, decrement buttons for pagination */}
                        <button className="w-40 bg-puddlePurple p-2 hover:-translate-y-1 transition duration-300"
                                onClick={() => {
                                    if ((minPageSize - 5 >= 0)) setMinPageSize(prevState => prevState - 5);
                                }}>Decrement
                        </button>

                        <button className="w-40 bg-puddlePurple p-2  hover:-translate-y-1 transition duration-300"
                                onClick={() => {
                                    if ((minPageSize + 5 <= groups.length)) setMinPageSize(prevState => prevState + 5);
                                }}>Increment
                        </button>
                    </div>

                    <div className={"space-x-10"}>
                        <button className={"bg-puddlePurple p-2 active:translate-y-1.5 hover:text-green-300 w-40"}
                                onClick={() => void router.push("/settings")}>User Settings
                        </button>
                        <button className={"bg-puddlePurple p-2 active:translate-y-1.5 hover:text-green-300 w-40"}
                                onClick={() => void router.push("/shareXInstructions")}>ShareX Steps
                        </button>
                    </div>

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