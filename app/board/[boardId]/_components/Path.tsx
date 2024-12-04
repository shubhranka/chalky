import { getSvgPathFromStroke } from "@/lib/utils";
import { PathLayer } from "@/types";
import { getStroke } from 'perfect-freehand'

interface PathProps {
    id: string
    layer: PathLayer
    onPointerDown: (e: React.PointerEvent, layerId: string) => void
    selectionColor?: string
}

const Path = (
    { id, layer, onPointerDown, selectionColor } : PathProps
) => {
    const drawingPoints = layer.points;
    
    return (
        <svg 
          width={layer.size.x} 
          height={layer.size.y}
          x={layer.position.x}
          y={layer.position.y}
          className="drop-shadow-2xl overflow-visible"
          onPointerDown={(e) => onPointerDown(e, id)}
        >
        
        <path 
            d={getSvgPathFromStroke(getStroke(drawingPoints))}
            fill={`rgb(${layer.fill.r},${layer.fill.g},${layer.fill.b})`} 
            strokeWidth={2} 
        />
            </svg>
        );
};

export default Path;