import {FC} from "react"
import { useRouter } from "next/router";
import ReusableButton from "~/components/reusableButton";


const UnauthorisedPasteAccess: FC = ({}) => {
    const router = useRouter()
    return(
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple ">
            <div className="m-auto">
                <h1>The paste you tried to access or edit is private.</h1>
                <h1 className={"mb-3"}>If this is your paste, please log in</h1>
                <ReusableButton text={"Return home"} onClick={() => void router.push("/")} />
            </div>
        </main>
    )
}

export default UnauthorisedPasteAccess