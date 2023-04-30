import { type FC, useState } from "react";
import { getServerAuthSession } from "~/server/auth";
import type { GetServerSidePropsContext } from "next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type { paste } from ".prisma/client";
import { nanoid } from "nanoid";
import Swal from "sweetalert2";
import ReusableButton from "~/components/reusableButton";

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
    const [modifiedKey,setModifiedKey] = useState<string>()


    const { data: userKey } = api.text.getUserKeyByID.useQuery<string>({ // Gets user key
        userID: user.id
    });

    const { mutate: editKey } = api.text.updateKey.useMutation<paste>();


    function logout() {
        void Swal.fire({
            title: 'Logout?',
            text: "If you logout, you will need to log back in to access your pastes.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm',
            background:"#433151",
            color:"#9e75f0",
        }).then(async (result) => {
            if(result.isConfirmed){
                await signOut().then(_ => {
                    void router.push("/");
                });
            }
        })
    }

    function handleChangeKey() {
        void Swal.fire({
            title: 'Reset Key?',
            text: "If you reset your key, you will need to set up ShareX again!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm Reset',
            background:"#433151",
            color:"#9e75f0",
        }).then((result) => {
            if(result.isConfirmed){
                const newKey = nanoid();
                editKey({
                    id: user.id,
                    key: newKey
                });
                setModifiedKey(newKey)
                setToggleKey(false)
                void Swal.fire({
                    toast: true,
                    text: "Reset Key",
                    showConfirmButton: false,
                    timer: 1000,
                    background: "#433151",
                    color: "#9e75f0",
                    icon: "success",
                    position: "top"
                });
            }
        })

    }

    function handleDeleteAccount(){
        void Swal.fire({
            title: 'Delete account?',
            text: "If you delete your account, all your pastes will also be permanently deleted",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm',
            background:"#433151",
            color:"#9e75f0",

        }).then(async (result) => {
            if(result.isConfirmed){
                await fetch("/api/deleteAccount/" + user.id).then(_ => {
                   void signOut().then(_ => {
                        void router.push("/");
                    });
                })
                }
        })
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
                                <h1>{userKey && !modifiedKey ? userKey.key : modifiedKey}</h1>
                            </div> :

                            <ReusableButton text={"Show Key"} onClick={() => setToggleKey(true)} overrideWidth={"large"}  />}
                    </div>

                </div>


                <div className={"flex flex-col items-center py-2 space-y-4"}>

                    <ReusableButton text={"Reset Key"} isDangerous={true} onClick={() => handleChangeKey()}  overrideWidth={"large"}/>
                    <ReusableButton text={"Delete Account"} isDangerous={true} onClick={() => handleDeleteAccount()}  overrideWidth={"large"}/>
                    <ReusableButton text={"Logout"}  onClick={() => void logout()} overrideWidth={"large"} />
                    <ReusableButton text={"Return"}  onClick={() => void router.push("/groupSelect")} overrideWidth={"large"} />
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