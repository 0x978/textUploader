import {FC} from "react"
import ReusableButton from "~/components/reusableButton";
import { useRouter } from "next/router";

interface ReusableReturnButtonProps {
    isDangerous?: boolean
    destination?: string
    text?: string
    width?: keyof typeof size;
}

const size = {
    "small": "w-30",
    "medium": "w-48",
    "large": "w-56"
}

const ReusableReturnButton: FC<ReusableReturnButtonProps> = ({isDangerous,destination,text,width}) => {
    const router = useRouter()

    return(
        <ReusableButton text={text ?? "Return"} onClick={() => void router.push(`/${destination ?? ""}`)} isDangerous={isDangerous ?? true} overrideWidth={width ?? "small"} />
    )
}

export default ReusableReturnButton