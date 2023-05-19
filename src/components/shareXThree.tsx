import React, {FC} from "react"
import StepThree from "/src/misc/StepThree.png"
import Image from "next/image";



const ShareXThree: FC = () => {
    return(
        <main className="flex text-center ">
            <div className="m-auto">
                <h1 className={"text-xl"}>Next select &quot;Import&quot;, then, &quot;From clipboard&quot;</h1>
                <div className={"flex justify-center"}>
                    <Image src={StepThree} alt={"Step two of shareX"} width={600} height={600}  />
                </div>
            </div>
        </main>
    )
}

export default ShareXThree