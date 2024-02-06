import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HintProps {
    children: React.ReactNode;
    content: string;
    side?: "left" | "right" | "top" | "bottom";
    sideOffset?: number;
}


const Hint = ({
    children,
    content,
    side = "bottom",
    sideOffset = 10
}: HintProps
) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} sideOffset={sideOffset} align="start">
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default Hint