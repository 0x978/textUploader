import { FC } from "react";
import { getServerAuthSession } from "~/server/auth";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

interface ShareXInstructionsProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}


const ShareXInstructions: FC<ShareXInstructionsProps> = ({ user }) => {
    const router = useRouter()

    function copyConfig() {
        const config = `{
  "Version": "14.1.0",
  "Name": "0x978",
  "DestinationType": "TextUploader",
  "RequestMethod": "POST",
  "RequestURL": "https://text.0x978.com/api/upload",
  "Body": "JSON",
  "Data": "{\\n  \\"text\\": \\"{input}\\",\\n  \\"key\\": \\"${user.id}\\"\\n}",
  "URL": "{json:url}",
  "ErrorMessage": "{json:error}"
}`;
        void navigator.clipboard.writeText(config);
    }


    return (
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple">
            <div className="m-auto space-y-3">
                <h1 className="text-3xl">ShareX instructions</h1>
                <h1 className={"text-xl"}>Press the button below to copy config</h1>
                <button onClick={() => copyConfig()} className="bg-puddlePurple px-3 py-1 hover:text-green-300 active:translate-y-1.5 ">Config</button>
                <h1>Then, right click shareX -{">"} custom uploader settings {">"} import {">"} from clipboard</h1>

                <button onClick={() => void router.push("/groupSelect")} className="bg-puddlePurple px-3 py-1 hover:text-red-300 active:translate-y-1.5">Return</button>
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