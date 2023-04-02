import {FC} from "react"
import {useRouter} from "next/router";
import {GetServerSidePropsContext} from "next";
import {api} from "~/utils/api";
import {paste} from ".prisma/client";
import swal from "sweetalert2"


interface ctx{
    password:string,
    id:string,
}

const RawPasteDisplay: FC<ctx> = (ctx) => {
    const router = useRouter()
    const text = router.query.text

    const { data: textData } = api.text.getTextByID.useQuery<paste[]>({
        textID: ctx.id
    })

    function handleCopy(){
    if(textData?.text){
        void navigator.clipboard.writeText(textData.text)
        void swal.fire({
            text: 'Copied!',
            toast: true,
            position: 'top',
            timer:1000,
            showConfirmButton:false,
        })
    }
    }

    return(
        <>
            <main className="flex h-screen bg-deepPurple font-sans text-white min-h-screen overflow-y-auto">
                <div className="space-y-5 px-5">
                    <button className="bg-puddlePurple w-24 active:translate-y-1" onClick={() => handleCopy()}>Copy</button>
                    <pre className="whitespace-pre-wrap">{textData?.text}</pre>
                </div>
            </main>

        </>
    )
}

export const getServerSideProps = (context:GetServerSidePropsContext) => {

    return({
        props:{
            id:context.query.id
        }
    })

}

export default RawPasteDisplay