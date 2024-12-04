import { createSmoothPath, getSvgPathFromStroke } from "@/lib/utils";
import { Color } from "@/types";
import { useOther, useOthers, useSelf } from "@liveblocks/react/suspense";
import getStroke from "perfect-freehand";

interface LivePathProps {
    color: Color
}
const LivePath = (
    { color }: LivePathProps
) => {
    const drawingPoints = useSelf(me => me.presence.drawingPoints);

    const otherDrawingPoints = useOthers(others => others.map(o => o.presence.drawingPoints));
    return (
        <>
        { drawingPoints && <path 
            d={getSvgPathFromStroke(getStroke(drawingPoints))} 
            fill="none" 
            stroke={`rgb(${color.r},${color.g},${color.b})`} 
            strokeWidth="2" 
            />
        }
        {otherDrawingPoints.map((points, index) => (
            <path 
                key={index} 
                d={getSvgPathFromStroke(getStroke(points))} 
                fill="none" 
                stroke={`rgb(${color.r},${color.g},${color.b})`} 
                strokeWidth="2" 
            />
        ))}
        </>
        );
};

export default LivePath;