import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { LayerType, Point, Side, XYWH } from "@/types";
import { useSelf, useStorage } from "@liveblocks/react/suspense";
import { memo } from "react";
interface SelectionBoxProps {
    onResizeHandler: (corner: Side, initialBound: XYWH) => void;
    onTranslateHandler: (e:React.PointerEvent) => void;
}
const  SelectionBox = memo((
    { onResizeHandler,
    onTranslateHandler,

    }: SelectionBoxProps
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
                width={w}
                height={h}
                fill="transparent"
                stroke="blue"
                strokeWidth={2}
                style={{pointerEvents: "none"}}
                onPointerDown={(e) => onTranslateHandler(e)}
            />

            {isShowingHandle && <rect
                x={x-HANDLE_WIDTH/2}
                y={y-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "nwse-resize"}}
                onPointerDown={(e) => onResizeHandler(Side.Left | Side.Top, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x+ w-HANDLE_WIDTH/2}
                y={y+ h-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "se-resize"}}
                onPointerDown={(e) => onResizeHandler(Side.Right | Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x + w-HANDLE_WIDTH/2}
                y={y-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "sw-resize"}} 
                onPointerDown={(e) => onResizeHandler(Side.Right | Side.Top, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x-HANDLE_WIDTH/2}
                y={y + h-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "ne-resize"}}
                onPointerDown={(e) => onResizeHandler(Side.Left | Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x + w/2-HANDLE_WIDTH/2}
                y={y-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "n-resize"}}
                onPointerDown={(e) => onResizeHandler(Side.Top, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x + w-HANDLE_WIDTH/2}
                y={y + h/2-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "e-resize"}}
                onPointerDown={(e) => onResizeHandler(Side.Right, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x + w/2-HANDLE_WIDTH/2}
                y={y + h-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "s-resize"}}
                onPointerDown={(e) => onResizeHandler(Side.Bottom, bounds)}
                stroke="blue"
            />}
            {isShowingHandle && <rect
                x={x-HANDLE_WIDTH/2}
                y={y + h/2-HANDLE_WIDTH/2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                fill="white"
                style={{cursor: "w-resize"}}
                onPointerDown={(e) => onResizeHandler(Side.Left, bounds)}
                stroke="blue"
            />}
        </>
    )
})


SelectionBox.displayName = "SelectionBox";
export default SelectionBox;