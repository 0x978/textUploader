import {FC} from "react"
import ReusableReturnButton from "~/components/reusableReturnButton";


const NotFound: FC = ({}) => {
    return(
        <main className="flex h-screen text-center bg-deepPurple text-superCoolEdgyPurple ">
            <div className="m-auto">
                <h1 className={"text-7xl"}>404</h1>
                <h1 className={"my-5 text-xl"}>The paste you requested was not found on the server</h1>
                <ReusableReturnButton text={"Return Home"} destination={"groupSelect"}/>
            </div>
        </main>
    )
}

export default NotFound