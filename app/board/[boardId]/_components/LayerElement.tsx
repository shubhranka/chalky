import { LayerType } from "@/types";
import { useStorage } from "@liveblocks/react/suspense";

interface LayerProps {
    layerId: string;
}
const LayerElement = (
    { layerId }: LayerProps
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
                />
        default:
            return null;

    }

};

export default LayerElement;