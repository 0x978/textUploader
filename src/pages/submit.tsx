import {FC, MouseEvent, useState} from "react"
import {useRouter} from "next/router";
import {GetServerSidePropsContext} from "next";
import {api} from "~/utils/api";
import {post} from ".prisma/client";

interface ctx {
    pwd: string;
}

const Submit: FC<ctx> = (ctx) => {
    const router = useRouter()
    const [title, setTitle] = useState<string>("")
    const [group, setGroup] = useState<string>("")
    const [text, setText] = useState<string>("")

    const {mutate:submitPaste} = api.text.submitPost.useMutation<post>()

    const redirect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        void router.push({pathname: "groupSelect", query: {pwd: ctx.pwd}}, "groupSelect")
    }

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let parsedGroup:string = group
        if(parsedGroup.length === 0){parsedGroup = "none"}

        submitPaste({
            title:title,
            group:parsedGroup,
            text:text,
        })
        void router.push({
            pathname:"groupSelect",
            query:{
                pwd:ctx.pwd
            }
        },"groupSelect")
    }


    return(
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple">
            <div className="m-auto">
                <h1 className="font-bold text-3xl my-5">Submit a new paste</h1>
                <form className="space-y-3 ">
                    <h1>Paste Title</h1>
                    <input onChange={(e) => setTitle(e.target.value)} className="bg-puddlePurple"/>
                    <h1>Paste group</h1>
                    <input onChange={(e) => setGroup(e.target.value)}  className="bg-puddlePurple"/>
                    <h1>Paste Text</h1>
                    <textarea onChange={(e) => setText(e.target.value)} className="bg-puddlePurple resize min-h-[5rem]"/>
                    <div>
                        <button  onClick={(e) => handleSubmit(e)} className="my-5 bg-puddlePurple w-44 hover:text-green-300 active:translate-y-1 active:text-green-500 py-2 px-4">Submit</button>
                    </div>
                    <button onClick={(e) => redirect(e)} className="bg-puddlePurple w-44 hover:text-red-300 active:translate-y-1 active:text-red-500 py-2 px-4">Return</button>
                </form>
            </div>
        </main>
    )
}

export const getServerSideProps = (context:GetServerSidePropsContext) => {
    const password = process.env.PASSWORD;
    if(context.query.pwd !== process.env.PASSWORD){
        return {
            redirect: {
                destination: '/stop',
                permanent: false,
            },
        }
    }

    return({
        props:{
            pwd:password
        }
    })

}

export default Submit