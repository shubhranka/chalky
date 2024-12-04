import { LayerType, Point } from "@/types";
import { useStorage } from "@liveblocks/react/suspense";
import Text from "./Text";

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
                    fill={`rgb(${layer.fill.r},${layer.fill.g},${layer.fill.b})`}
                    style={{
                        transform: `translate(${layer.position.x}px, ${layer.position.y}px)`,
                    }}
                    className="drop-shadow-xl"
                    stroke={selectionColor || "transparent"}
                    onPointerDown={(e) => onLayerPointerDown(e, layerId)}
                    strokeWidth={selectionColor ? 2 : 0}
                />
        case LayerType.Ellipse:
            return <ellipse
                cx={layer.size.x / 2}
                cy={layer.size.y / 2}
                rx={layer.size.x / 2}
                ry={layer.size.y / 2}
                fill={`rgb(${layer.fill.r},${layer.fill.g},${layer.fill.b})`}
                style={{
                    transform: `translate(${layer.position.x}px, ${layer.position.y}px) rotate(${layer.rotation}deg)`,
                }}
                className="drop-shadow-xl"
                stroke={selectionColor || "transparent"}
                onPointerDown={(e) => onLayerPointerDown(e, layerId)}
                strokeWidth={selectionColor ? 2 : 0}
            />
        case LayerType.Text:
            return <Text
                id={layerId}
                layer={layer}
                onPointerDown={onLayerPointerDown}
                selectionColor={selectionColor}
            />
        case LayerType.Sticky:
            return <Text
                id={layerId}
                layer={layer}
                onPointerDown={onLayerPointerDown}
                selectionColor={selectionColor}
                />
        default:
            return null;

    }

};

export default LayerElement;