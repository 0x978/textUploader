import {FC} from "react"
import StepFour from "/src/misc/StepFour.png"
import Image from "next/image";

const ShareXFour: FC = () => {
    return(
        <main className="flex text-center ">
            <div className="m-auto">
                <h1 className={"text-xl"}>Finally, once added, ensure &quot;Text Uploader&quot; is set to &quot;0x978 - Text Uploader&quot;</h1>
                <div className={"flex justify-center"}>
                    <Image src={StepFour} alt={"Step four of shareX"} width={600} height={600}  />
                </div>
            </div>
        </main>
    )
}

export default ShareXFour