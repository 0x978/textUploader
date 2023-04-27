import { FC, useState } from "react";
import ReusableButton from "~/components/reusableButton";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import swal from "sweetalert2"

interface pasteExist{
    doesExist:boolean
}

const CustomURL: FC = () => {
    const router = useRouter()
    const id = router?.query?.id as string
    const initialURL = router?.query?.URL as string
    const [URLValue,setURLValue] = useState<string>(initialURL)
    const { mutate: update} = api.text.updateURL.useMutation();


    async function updateURL(){
        await fetch("/api/doesPasteExist/" + URLValue).then(r => {
            return r.json().then((data: pasteExist): void => {
                if (data?.doesExist) {
                    void swal.fire({
                        title: "ERROR",
                        text: "The given URL is not Unique",
                        toast: true,
                        position: "top",
                        timer: 1500,
                        icon: "error",
                        showConfirmButton: false,
                        background: "#433151",
                        color: "#9e75f0",
                    });
                }
                else{
                    update({
                        id:id,
                        accessID:URLValue
                    })
                    void swal.fire({
                        title:"SUCCESS",
                        text: "The URL has been updated.",
                        toast: true,
                        position: "top",
                        timer: 1500,
                        icon:"success",
                        showConfirmButton: false,
                        background:"#433151",
                        color:"#9e75f0",
                    });
                }
            })
        })
    }


    return(
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple ">
            <div className="m-auto">
                <h1 className={"text-3xl"}>Custom URL</h1>
                <h1 className={"text-xl my-3"}>Here you can set a custom URL that is more memorable than the default URL</h1>
                <h1 className={"text-xl my-3"}>This URL needs to be Unique!</h1>


                <h1>Current URL: www.text.0x978.com/paste?id={URLValue}</h1>
                <div className={"flex flex-col my-5 space-y-4 justify-center text-center items-center"}>
                    <input className={"bg-puddlePurple w-96"} onChange={(e) => setURLValue(e.target.value)}/>
                    <ReusableButton text={"Submit"} onClick={() => updateURL()} />
                    <ReusableButton text={"Return"} onClick={() => void router.push("/edit?id="+URLValue)} />
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