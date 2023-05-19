import React, {FC} from "react"
import Image from "next/image";
import StepTwo from "/src/misc/StepTwo.png"



const ShareXTwo: FC = () => {
    return(
        <main className="flex text-center ">
            <div className="m-auto">
                <h1 className={"text-xl"}>Next, open the Taskbar Notification Area and select &quot;Custom Uploader Settings&quot;  </h1>
                <div className={"flex justify-center"}>
                    <Image src={StepTwo} alt={"Step Three of shareX"}  />
                </div>
            </div>
        </main>
    )
}

export default ShareXTwo