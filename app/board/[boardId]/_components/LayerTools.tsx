import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera, Color } from "@/types";
import { memo } from "react";
import ColorPicker from "./ColorPicker";
import { useSelf } from "@liveblocks/react/suspense";

interface LayerToolsProps {
    camera: Camera
    lastUsedColor?: Color
    setLastUsedColor: (color: Color) => void
}

const LayerTools = memo((
    {camera, lastUsedColor, setLastUsedColor}: LayerToolsProps
) => {

    const bounds = useSelectionBounds();

    if (!bounds) return null;
    const x = bounds?.x + bounds?.w/2 + camera.x;
    const y = bounds?.y + camera.y;

  return (
    <div className="absolute bg-white rounded-xl px-1.5 py-1.5 shadow-md"   
        style={{
            transform: `translate(
                calc(${x}px - 50%),
                calc(${y - 16}px - 100%)
            )`
        }}
        >
        <ColorPicker onPickColor={setLastUsedColor}/>
    </div>
  );
});

LayerTools.displayName = "LayerTools";

export default LayerTools;