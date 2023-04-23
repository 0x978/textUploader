import React, {FC} from "react"

interface ReusableButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>; // Add onClick prop
    text: string
    isDangerous ?: boolean
    overrideWidth?: "small" | "medium" | "large"
    overrideTextColour ?: string
    overrideHoverTextColour ?: string
    overrideBackground ?: string // format: "bg-col-val-"
}

const ReusableButton: FC<ReusableButtonProps> = ({onClick,text,isDangerous,overrideWidth,overrideTextColour,overrideHoverTextColour,overrideBackground}) => {

    const size = {
        "small": "w-30",
        "medium": "w-50",
        "large": "w-56"
    }

    const danger:string = isDangerous ? `bg-fadedRed text-white` : (overrideBackground ?? `bg-puddlePurple`)
    const width = overrideWidth ? size[overrideWidth] : "w-40"
    const textCol = overrideTextColour ? `text-${overrideTextColour}` : "text-superCoolEdgyPurple"
    const hoverTextCol = overrideHoverTextColour ? `hover:text-${overrideHoverTextColour}` : "hover:text-emerald-300"

    return(
        <button
            className={`${hoverTextCol} ${danger} ${width} ${textCol} p-2 transition duration-200 active:translate-y-1.5 `}
            onClick={onClick}>{text}
        </button>
    )
}

export default ReusableButton