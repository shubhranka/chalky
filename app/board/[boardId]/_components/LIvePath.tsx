import { createSmoothPath } from "@/lib/utils";
import { Color } from "@/types";
import { useSelf } from "@liveblocks/react/suspense";

interface LivePathProps {
    color: Color
}
const LivePath = (
    { color }: LivePathProps
) => {
    const drawingPoints = useSelf(me => me.presence.drawingPoints);
    return (
        <path 
            d={createSmoothPath(drawingPoints)} 
            fill="none" 
            stroke={`rgb(${color.r},${color.g},${color.b})`} 
            strokeWidth="2" 
        />
        );
};

export default LivePath;