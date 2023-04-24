import React, {FC} from "react"

interface ReusableButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>; // Add onClick prop
    text: string
    isDangerous ?: boolean
    overrideWidth?: keyof typeof size;
    overrideTextColour ?: keyof typeof textColour;
    overrideHoverTextColour ?: keyof typeof hoverColour
    overrideBackground ?: keyof typeof bgColour
    injectCustomProperty ?: string
}

const size = {
    "small": "w-30",
    "medium": "w-50",
    "large": "w-56"
}
const textColour = {
    "red": "text-red-300",
    "blue": "text-blue-300",
    "green": "text-green-300",
    "sky": "text-sky-300",
    "orange": "text-amber-300",
    "white": "text-white",
    "puddlePurple": "text-puddlePurple"
}

const hoverColour = {
    "red": "hover:text-red-300",
    "blue": "hover:text-blue-300",
    "green": "hover:text-green-300",
    "sky": "hover:text-sky-300",
    "orange": "hover:text-amber-300",
}

const bgColour = {
    "red": "bg-red-500",
    "blue": "bg-blue-500",
    "green": "bg-emerald-600",
    "sky": "bg-sky-500",
    "orange": "bg-amber-500",
}

const ReusableButton: FC<ReusableButtonProps> = ({onClick,text,isDangerous,overrideWidth,overrideTextColour
                                                     ,overrideHoverTextColour,overrideBackground,injectCustomProperty}) => {


    const danger = isDangerous ? `bg-fadedRed text-white` : `bg-puddlePurple`
    const width = overrideWidth ? size[overrideWidth] : "w-40"
    const textCol = overrideTextColour ? textColour[overrideTextColour] : "text-superCoolEdgyPurple"
    const hoverTextCol = overrideHoverTextColour ? hoverColour[overrideHoverTextColour] : "hover:text-emerald-300"
    const background = overrideBackground ? bgColour[overrideBackground] : "bg-puddlePurple"

    return(
        <button
            className={`${background === "bg-puddlePurple" && danger ? danger : background} ${hoverTextCol} 
            ${danger} ${width} ${textCol} p-2 transition duration-200 active:translate-y-1.5  `}
            onClick={onClick}>{text}
        </button>
    )
}

export default ReusableButton