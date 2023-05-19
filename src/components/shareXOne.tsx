import React, {FC} from "react"
import ReusableButton from "~/components/reusableButton";

interface ShareXOneProps {
    copyConfig: () => void;
}

const ShareXOne: FC<ShareXOneProps> = ({copyConfig}) => {
    return(
        <main className="flex bg-deepPurple text-superCoolEdgyPurple  ">
            <div className="m-auto my-3 space-y-5 ">
                <h1 className={"text-xl"}>First, copy the config to your clipboard using the button below.</h1>
                <ReusableButton text={"Copy Config"} onClick={() => copyConfig()} />
            </div>
        </main>
    )
}

export default ShareXOne