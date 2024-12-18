import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera, Color, Layer, LayerType, NoteLayer, TextLayer } from "@/types";
import { memo, useState } from "react";
import ColorPicker from "./ColorPicker";
import { useMutation, useSelf } from "@liveblocks/react/suspense";
import { BringToFront, Minus, MoveDown, MoveUp, Plus, SendToBack, Trash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { LiveObject } from "@liveblocks/client";

interface TextLayerToolsProps {
    layer: TextLayer | NoteLayer
    camera: Camera
}

const TextLayerTools = memo((
    {camera,layer}: TextLayerToolsProps
) => {

    const onIncreaseSize = useMutation(({storage}) => {
        const textLayer : LiveObject<TextLayer | NoteLayer> | undefined = storage.get("layers").get(layer.id) as LiveObject<TextLayer | NoteLayer>;
        textLayer?.set("fontSize", textLayer.get("fontSize") + 1);
    },[]);

    const onDecreaseSize = useMutation(({storage}) => {
        const textLayer : LiveObject<TextLayer | NoteLayer> | undefined = storage.get("layers").get(layer.id) as LiveObject<TextLayer | NoteLayer>;
        textLayer?.set("fontSize", textLayer.get("fontSize") - 1);
    },[]);

  return (
    <div className="absolute bg-white rounded-xl px-1.5 py-1.5 shadow-md flex flex-row gap-3 items-center justify-center"   
        style={{
            transform: `translate(
                calc(${(layer.position.x + layer.size.x/2) * camera.scale}px - 50%),
                calc(${(layer.position.y*camera.scale - 80)}px - 100%)
            )`
        }}
        >
        <Plus className="h-5 w-5 p-1 hover:bg-gray-200 rounded-sm cursor-pointer text-black-500" onClick={onIncreaseSize}/>
        <Minus className="h-5 w-5 p-1 hover:bg-gray-200 rounded-sm cursor-pointer text-black-500" onClick={onDecreaseSize}/>
    </div>
  );
});

TextLayerTools.displayName = "LayerTools";

export default TextLayerTools;