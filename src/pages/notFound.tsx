import {FC} from "react"
import ReusableButton from "~/components/reusableButton";
import { useRouter } from "next/router";


const NotFound: FC = ({}) => {
    const router = useRouter()
    return(
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple ">
            <div className="m-auto">
                <h1 className={"text-7xl"}>404</h1>
                <h1 className={"my-5 text-xl"}>The paste you requested was not found on the server</h1>
                <ReusableButton text={"Return Home"} onClick={() => void router.push("/groupSelect")} />
            </div>
        </main>
    )
}

export default NotFound