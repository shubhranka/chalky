import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { LayerType, Side, XYWH } from "@/types";
import { useSelf, useStorage } from "@liveblocks/react/suspense";
import { memo } from "react";
interface SelectionBoxProps {
    onResizeHandler: (corner: Side, initialBound: XYWH) => void;
}
const  SelectionBox = memo((
    { onResizeHandler }: SelectionBoxProps
)=>{

    const HANDLE_WIDTH = 10;

    const soleLayerId = useSelf(me=>me.presence.selection?.[0]);

    const isShowingHandle = useStorage(storage => soleLayerId && storage.layers.get(soleLayerId)?.type !== LayerType.Pencil);

    const bounds = useSelectionBounds();

    if (!bounds) return null;

    const {x,y,w,h} = bounds;

    return (
        <>
            <rect
                x={x}
                y={y}
                width={w-x}
                height={h-y}
                fill="transparent"
                stroke="blue"
                strokeWidth={2}
                style={{pointerEvents: "none"}}
            />

            {isShowingHandle && <rect
                x={x-HANDLE_WIDTH/2}
                y={y-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "nwse-resize"}}
                // onPointerDown={(e) => onResizeHandler(Side.Left | Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={w-HANDLE_WIDTH/2}
                y={h-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "se-resize"}}
                // onPointerDown={(e) => onResizeHandler(Side.Left | Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={w-HANDLE_WIDTH/2}
                y={y-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "sw-resize"}} 
                // onPointerDown={(e) => onResizeHandler(Side.Left | Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x-HANDLE_WIDTH/2}
                y={h-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "ne-resize"}}
                // onPointerDown={(e) => onResizeHandler(Side.Left | Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x + (w-x)/2-HANDLE_WIDTH/2}
                y={y-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "n-resize"}}
                // onPointerDown={(e) => onResizeHandler(Side.Left | Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={w-HANDLE_WIDTH/2}
                y={y + (h-y)/2-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "e-resize"}}
                // onPointerDown={(e) => onResizeHandler(Side.Left | Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x + (w-x)/2-HANDLE_WIDTH/2}
                y={h-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "s-resize"}}
                // onPointerDown={(e) => onResizeHandler(Side.Left | Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x-HANDLE_WIDTH/2}
                y={y + (h-y)/2-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "w-resize"}}
                // onPointerDown={(e) => onResizeHandler(Side.Left | Side.Bottom, bounds)}
                stroke="blue"
            />}
        </>
    )
})


SelectionBox.displayName = "SelectionBox";
export default SelectionBox;