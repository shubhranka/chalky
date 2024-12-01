import { LayerType, Point } from "@/types";
import { useStorage } from "@liveblocks/react/suspense";

interface LayerProps {
    layerId: string;
    selectionColor?: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
}
const LayerElement = (
    { layerId,
    selectionColor,
    onLayerPointerDown,
    }: LayerProps
) => {
    const layer = useStorage(storage => storage.layers.get(layerId));
    if (!layer) {
        return null;
    }
    switch (layer.type) {
        case LayerType.Rectangle:
                return <rect
                    x={0}
                    y={0}
                    width={layer.size.x}
                    height={layer.size.y}
                    fill={`rgba(${layer.fill.r},${layer.fill.g},${layer.fill.b},${layer.fill.a})`}
                    style={{
                        transform: `translate(${layer.position.x}px, ${layer.position.y}px)`,
                    }}
                    className="drop-shadow-lg"
                    stroke={selectionColor || "transparent"}
                    onPointerDown={(e) => onLayerPointerDown(e, layerId)}
                    strokeWidth={selectionColor ? 2 : 0}
                />
        default:
            return null;

    }

};

export default LayerElement;