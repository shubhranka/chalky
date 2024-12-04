import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera, Color } from "@/types";
import { memo, useState } from "react";
import ColorPicker from "./ColorPicker";
import { useMutation, useSelf } from "@liveblocks/react/suspense";
import { BringToFront, MoveDown, MoveUp, SendToBack, Trash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface LayerToolsProps {
    camera: Camera
    lastUsedColor?: Color
    setLastUsedColor: (color: Color) => void
    deleteLayer: () => void
}

const LayerTools = memo((
    {camera, lastUsedColor, setLastUsedColor, deleteLayer}: LayerToolsProps
) => {

    const [movingUp, setMovingUp] = useState(false);
    const [movingDown, setMovingDown] = useState(false);

    const onMoveUp = useMutation(({ storage, self }) => {
        setMovingUp(true);
        const selectedLayers = self.presence.selection;
        const layerIds = storage.get("layerIds");
        for (const layerId of selectedLayers) {
          const layerIndex = layerIds.indexOf(layerId);
          if (layerIndex === 0) continue;
          layerIds.move(layerIndex, layerIndex - 1);
        }
        setMovingUp(false);
      }, []);
    
      const onMoveDown = useMutation(({ storage, self }) => {
        setMovingDown(true);
        const selectedLayers = self.presence.selection;
        const layerIds = storage.get("layerIds");
        for (const layerId of selectedLayers) {
          const layerIndex = layerIds.indexOf(layerId);
          if (layerIndex === layerIds.length - 1) continue;
          layerIds.move(layerIndex, layerIndex + 1);
        }
        setMovingDown(false);
      }, []);

    const bounds = useSelectionBounds();

    if (!bounds) return null;
    const x = bounds?.x + bounds?.w/2 + camera.x;
    const y = bounds?.y + camera.y;

  return (
    <div className="absolute bg-white rounded-xl px-1.5 py-1.5 shadow-md flex flex-row gap-3 items-center justify-center"   
        style={{
            transform: `translate(
                calc(${x*camera.scale}px - 50%),
                calc(${y*camera.scale - 16}px - 100%)
            )`
        }}
        >
        <ColorPicker onPickColor={setLastUsedColor}/>
        <div className="flex flex-row items-center justify-center gap-0">
        {!movingUp && <SendToBack size={50} className="h-10 w-10 p-2 hover:bg-gray-200 rounded-sm cursor-pointer text-black-500" onClick={onMoveUp}/>}
        {(movingUp || movingDown) && <Spinner size={"small"} className="h-10 w-10 p-2 hover:bg-gray-200 rounded-sm cursor-pointer text-black-500" />}
        {!movingDown && <BringToFront size={50} className="h-10 w-10 p-2 hover:bg-gray-200 rounded-sm cursor-pointer text-black-500" onClick={onMoveDown} />}
        </div>
        <Trash size={50} className="h-10 w-10 p-2 hover:bg-gray-200 rounded-sm cursor-pointer text-red-500" onClick={deleteLayer}/>
    </div>
  );
});

LayerTools.displayName = "LayerTools";

export default LayerTools;