import {FC, useEffect, useState} from "react"
import {api} from "~/utils/api";
import {post} from ".prisma/client";
import {GetServerSidePropsContext} from "next";
import {useRouter} from "next/router";

interface ctx{
    pwd:string
}

const GroupSelect: FC<ctx> = (ctx) => {

    const router = useRouter()

    const [paginatedGroups,setPaginatedGroups] = useState<string[]>([])
    const [groups,setGroups] = useState<string[]>([])
    const [groupMap,setGroupMap] = useState<Map<string,number>>()
    const pageSize = 5;
    const [minPageSize,setMinPageSize] = useState<number>(0)



    const redirect = (group:string) => { // redirects user to paste selection when a group is selected.
        void router.push({
            pathname:"pasteSelect",
            query:{
                pwd:ctx.pwd,
                group:group
            }
        },"pasteSelect")

    }

    const { data: textData,isLoading } = api.text.getAllText.useQuery<post[]>(undefined,{ // fetches all texts, parsing their groups to display each available group. This is not sustainable
        onSuccess(res:post[]){
            const uniqueGroup = new Map<string,number>();
            res.forEach(r => {
                const count = uniqueGroup.get(r.group);
                uniqueGroup.set(r.group, (count ? count + 1 : 1));
            });
            const uniqueKeys = Array.from(uniqueGroup.keys())
            setGroups(uniqueKeys)
            setGroupMap(uniqueGroup)
            setPaginatedGroups(uniqueKeys?.slice(minPageSize,5))
        }
    })

    useEffect(() => {
        setPaginatedGroups(groups?.slice(minPageSize,minPageSize+pageSize))
    },[minPageSize])


    return(
        <>
            <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple">
                <div className="m-auto">

                    <h1 className="font-bold text-3xl my-5 ">Select a category</h1>
                    <button onClick={() => void router.push({pathname:"submit",query:{pwd:ctx.pwd}},"submit")}
                            className="bg-puddlePurple w-44 hover:text-green-300 active:translate-y-1 active:text-green-500 py-2 px-4">
                        Create new post
                    </button>

                    {isLoading ? // if fetching categories, display as such.
                        <h1> Loading categories... </h1>

                    : // once categories are fetched, map through them and display them as divs:
                        paginatedGroups.map((group,i) => {
                                return(
                                    <div key={i} className="flex space-x-1.5" onClick={() => redirect(group)}>
                                        <div  key={i} className=" text-lg relative flex flex-col justify-center items-center bg-puddlePurple w-96
                                    h-16 rounded-lg my-5 py-2 shadow-lg cursor-pointer hover:scale-110 transition duration-300">
                                            <h1 className="m1-2 ">{group}</h1>
                                            <h1>count: {groupMap?.get(group)}</h1>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    <div className="my-5 space-x-10 ">
                        <button className="w-40 bg-puddlePurple p-2 hover:-translate-y-1 transition duration-300" onClick={() => {if((minPageSize-5 >= 0))setMinPageSize(prevState => prevState-5)}}>Decrement</button>
                        <button className="w-40 bg-puddlePurple p-2  hover:-translate-y-1 transition duration-300" onClick={() => {if((minPageSize+5 <= groups.length))setMinPageSize(prevState => prevState+5)}}>Increment</button>
                    </div>

                </div>
            </main>
        </>
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

export default GroupSelect