import type { FC } from "react";
import { getServerAuthSession } from "~/server/auth";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Swal from "sweetalert2"
import ReusableButton from "~/components/reusableButton";
import { useState } from "react";
import ShareXOne from "~/components/shareXOne";
import ShareXTwo from "~/components/shareXTwo";
import ShareXThree from "~/components/shareXThree";
import ShareXFour from "~/components/shareXFour";

interface ShareXInstructionsProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}


const ShareXInstructions: FC<ShareXInstructionsProps> = ({ user }) => {
    const [step,setStep] = useState<number>(1)

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
                <h1 className="text-4xl">ShareX instructions: Step {step}</h1>

                {step === 1 &&
                  <ShareXOne copyConfig={() => copyConfig()}/>}
                {step === 2 &&
                  <ShareXTwo/>}
                {step === 3 &&
                  <ShareXThree/>}
                {step === 4 &&
                  <ShareXFour/>}



                <div className={"space-x-2"}>
                    {step > 1 && <ReusableButton text={"Previous Step"} onClick={() => setStep(prevState => prevState-1)} />}
                    {step <4 && <ReusableButton text={"Next Step"} onClick={() => setStep(prevState => prevState+1)} />}

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

export default ShareXInstructions;