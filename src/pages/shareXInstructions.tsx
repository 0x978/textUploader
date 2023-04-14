import { FC } from "react";
import { getServerAuthSession } from "~/server/auth";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Swal from "sweetalert2"
import ReusableButton from "~/components/reusableButton";

interface ShareXInstructionsProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}


const ShareXInstructions: FC<ShareXInstructionsProps> = ({ user }) => {
    const router = useRouter()

    const { data: userKey } = api.text.getUserKeyByID.useQuery<string>({ // Gets user key
        userID: user.id
    })

    function copyConfig() {
        if(userKey ){
            const config = `{
  "Version": "14.1.0",
  "Name": "0x978-Text-Uploader",
  "DestinationType": "TextUploader",
  "RequestMethod": "POST",
  "RequestURL": "https://text.0x978.com/api/upload",
  "Body": "JSON",
  "Data": "{\\n  \\"text\\": \\"{input}\\",\\n  \\"key\\": \\"${userKey?.key.trim()}\\"\\n}", 
  "URL": "{json:url}",
  "ErrorMessage": "{json:error}"
}`;
            void Swal.fire({
                toast:true,
                text:"Copied to clipboard",
                showConfirmButton:false,
                timer:1000,
                background:"#433151",
                color:"#9e75f0",
                icon:"success",
                position:"top"
            })
            void navigator.clipboard.writeText(config);
        }
        else{
            void Swal.fire({
                icon: 'error',
                title: 'Error',
                background:"#433151",
                color:"#9e75f0",
                confirmButtonColor: "#9e75f0",
                text: 'Failed to fetch key, try logging out and back in again ' })
        }
    }


    return (
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple">
            <div className="m-auto space-y-3">
                <h1 className="text-3xl">ShareX instructions</h1>
                <h1 className={"text-xl"}>Press the button below to copy config</h1>
                <ReusableButton text={"Config"} onClick={() => copyConfig()} />
                <h1>Then, right click shareX -{">"} custom uploader settings {">"} import {">"} from clipboard</h1>

                <ReusableButton text={"Return"} isDangerous={true} onClick={() => void router.push("/groupSelect")} />
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

export default ShareXInstructions;