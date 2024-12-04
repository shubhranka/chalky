import { createSmoothPath } from "@/lib/utils";
import { Color } from "@/types";
import { useOther, useOthers, useSelf } from "@liveblocks/react/suspense";

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
        <path 
            d={createSmoothPath(drawingPoints)} 
            fill="none" 
            stroke={`rgb(${color.r},${color.g},${color.b})`} 
            strokeWidth="2" 
            />

        {otherDrawingPoints.map((points, index) => (
            <path 
                key={index} 
                d={createSmoothPath(points)} 
                fill="none" 
                stroke={`rgb(${color.r},${color.g},${color.b})`} 
                strokeWidth="2" 
            />
        ))}
        </>
        );
};

export default LivePath;