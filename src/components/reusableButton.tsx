import React, {FC} from "react"

interface ReusableButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>; // Add onClick prop
    text: string
    isDangerous ?: boolean
    overrideWidth?: number
    overrideTextColour ?: string
    overrideHoverTextColour ?: string
}

const ReusableButton: FC<ReusableButtonProps> = ({onClick,text,isDangerous,overrideWidth,overrideTextColour,overrideHoverTextColour}) => {

    const danger:string = isDangerous ? "bg-fadedRed text-white" : "bg-puddlePurple "
    const width = overrideWidth ? `w-${overrideWidth}` : "w-40"
    const textCol = overrideTextColour ?? "superCoolEdgyPurple"
    const hoverTextCol = overrideHoverTextColour ?? "emerald-300"

    return(
        <button
            className={` ${width} text-${textCol} p-2 hover:text-${hoverTextCol} transition duration-200 active:translate-y-1.5 ${danger} `}
            onClick={onClick}>{text}
        </button>
    )
}

export default ReusableButton