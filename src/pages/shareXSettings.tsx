import { FC, useState } from "react";
import { api } from "~/utils/api";
import { paste } from ".prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import ReusableButton from "~/components/reusableButton";
import { useRouter } from "next/router";
import swal from "sweetalert2";

interface ShareXSettingsProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const ShareXSettings: FC<ShareXSettingsProps> = ({user}) => {
    const router = useRouter()
    const [group,setGroup] = useState<string>("")



    const{data} = api.user.getUserDefaultGroup.useQuery<paste[]>({ // fetches all texts, parsing their groups to display each available group. This is not sustainable
        userID: user.id
    },{onSuccess(res){
        if(res){
            setGroup(res?.defaultPasteGroup)
        }
        }})

    const { mutate: updateGroup } = api.user.updateDefaultGroup.useMutation({
        onSuccess:() =>{
            void swal.fire({
                title:"Default Group Updated!",
                text: "",
                icon:"success",
                timer: 1300,
                toast:true,
                position:"top",
                showConfirmButton: false,
                background:"#433151",
                color:"#9e75f0",
            })
        }
    })


    return(
        <main className="flex py-4 h-screen text-center bg-deepPurple text-superCoolEdgyPurple ">
            <div className="flex flex-col items-center m-auto space-y-5">
                <h1 className={"text-4xl"}>ShareX Settings</h1>
                <label className={"px-3"}>Default paste group:</label>
                <input placeholder={group} onChange={(e) => setGroup(e.target.value)} className="bg-puddlePurple w-full md:w-96 p-1" />
                <ReusableButton text={"Save Changes"} onClick={() => updateGroup({id:user.id,groupName:group})}  />
                <ReusableButton text={"Return"} isDangerous={true} onClick={() => void router.push("/")} />
            </div>
        </main>
    )
}

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

export default ShareXSettings