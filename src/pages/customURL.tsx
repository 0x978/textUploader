import { FC, useState } from "react";
import ReusableButton from "~/components/reusableButton";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { paste } from ".prisma/client";

const CustomURL: FC = () => {
    const router = useRouter()
    const id = router?.query?.id as string

    const [URLValue,setURLValue] = useState<string>(id)


    async function updateURL(){
        fetch("/api/doesPasteExist/"+URLValue,).then(r => {
            r.json().then(data => {
                if(data.doesExist){
                    return;
                }
            })
        })
        alert("Temp placeholder")
    }


    return(
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple ">
            <div className="m-auto">
                <h1 className={"text-3xl"}>Custom URL</h1>
                <h1 className={"text-xl my-3"}>Here you can set a custom URL that is more memorable than the default URL</h1>

                <h1>Current URL: www.text.0x978.com/text?id={URLValue}</h1>
                <div className={"flex flex-col my-5 space-y-2 justify-center text-center items-center"}>
                    <input className={"bg-puddlePurple w-96"} onChange={(e) => setURLValue(e.target.value)}/>
                    <ReusableButton text={"Submit"} onClick={() => updateURL()} />
                </div>
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

    const paste = await prisma.paste.findUnique({
        select:{
            userID: true,
        },
        where:{
            id:ctx.query.id as string
        }
    })

    if(!paste || (paste.userID !== auth.user.id)){
        return {
            redirect: {
                destination: "/unauthorisedPasteAccess",
                permanent: false
            }
        };
    }

    return {
        props: {
            user,
            id: ctx.query.id
        }
    };
}

export default CustomURL