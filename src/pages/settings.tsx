import { FC, useState } from "react";
import { getServerAuthSession } from "~/server/auth";
import { GetServerSidePropsContext } from "next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

interface SettingsProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const Settings: FC<SettingsProps> = ({ user }) => {
    const router = useRouter();
    const [toggleKey, setToggleKey] = useState<boolean>(false);

    const { data: userKey } = api.text.getUserKeyByID.useQuery<string>({ // Gets user key
        userID: user.id
    })


    async function logout() {
        await signOut().then(_ => {
            void router.push("/");
        });
    }

    return (
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple ">
            <div className="m-auto space-y-5">
                <h1 className={"text-3xl"}>Settings</h1>

                <div className="space-y-2">
                    <h1 className={"text-xl"}>User Details:</h1>
                    <h1>Username: {user.name}</h1>
                    <h1>email: {user.email}</h1>

                    <div className={"my-2"}>
                        {toggleKey ?
                            <div className={"my-5 space-y-3"}>
                                <h1>Do not share this key with anyone, as it allows people to upload pastes as you!</h1>
                                <h1>{userKey ? userKey.key : "Failed to fetch key"}</h1>
                            </div>:

                            <button onClick={() => setToggleKey(true)} className={"bg-puddlePurple p-2 "}>Show
                                Key </button>}
                    </div>

                </div>


                <div className={"flex flex-col items-center space-y-3"}>
                    <button className={"bg-puddlePurple w-40 p-2 hover:text-red-300 active:translate-y-1.5"}
                            onClick={() => void logout()}>Logout
                    </button>
                    <button className={"bg-puddlePurple w-40 p-2 hover:text-green-300 active:translate-y-1.5"}
                            onClick={() => void router.push("/groupSelect")}>Return
                    </button>
                </div>

            </div>
        </main>
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

export default Settings;