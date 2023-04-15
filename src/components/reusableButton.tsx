import React, {FC} from "react"

interface ReusableButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>; // Add onClick prop
    text: string
    isDangerous ?: boolean
    overrideWidth?: number
    overrideTextColour ?: string
    overrideHoverTextColour ?: string
    overrideBackground ?: string // format: "bg-col-val-"
}

const ReusableButton: FC<ReusableButtonProps> = ({onClick,text,isDangerous,overrideWidth,overrideTextColour,overrideHoverTextColour,overrideBackground}) => {

    const danger:string = isDangerous ? "bg-fadedRed text-white" : (overrideBackground ?? "bg-puddlePurple")
    const width = overrideWidth ? `w-${overrideWidth}` : "w-40"
    const textCol = overrideTextColour ?? "superCoolEdgyPurple"
    const hoverTextCol = overrideHoverTextColour ?? "emerald-300"

    return(
        <button
            className={` ${danger} ${width} text-${textCol} p-2 hover:text-${hoverTextCol} transition duration-200 active:translate-y-1.5 `}
            onClick={onClick}>{text}
        </button>
    )
}

export default ReusableButton