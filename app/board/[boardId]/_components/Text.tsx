import { TextLayer } from "@/types";
import { useMutation } from "@liveblocks/react";
import { Kalam } from "next/font/google";
import { useState } from "react";
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
const font = Kalam({
    subsets: ["latin"],
    weight: ["400"]
})
interface TextProps {
    id: string
    layer: TextLayer
    onPointerDown: (e: React.PointerEvent, layerId: string) => void
    selectionColor?: string
}


const Text = (
    {id, layer, onPointerDown, selectionColor} : TextProps
) => {
    const debounce = (fn: (value:string) => void, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (value: string) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                fn(value);
            }, delay);
        };
    }

    const updateText = useMutation(({storage}, value) => {
        const textLayer = storage.get("layers").get(id)
        textLayer?.set("value", value)
    },[]);

    const deboundedUpdateText = debounce(updateText, 500);

    const debouncedUpdateText = (e: ContentEditableEvent) => {
        const value = e.target.value;
        deboundedUpdateText(value);
    }  

    return <foreignObject 
        x={layer.position.x}
        y={layer.position.y}
        width={layer.size.x}
        height={layer.size.y}
        onPointerDown={(e)=> onPointerDown(e,id)}
        style={{
            outline: selectionColor ? `1px solid ${selectionColor}` : "none" 
        }}
        >
        <ContentEditable
            html={layer.value || "text"}
            onChange={(e)=>debouncedUpdateText(e)}
            style={{
                fontFamily: font.style.fontFamily,
                // fontSize: layer.size.y * 0.6,
                fontSize: layer.fontSize || 16,
                color: `rgb(${layer.fill.r},${layer.fill.g},${layer.fill.b})`,
                transform: `rotate(${layer.rotation}deg)`,
            }}
        />

    </foreignObject>
};

export default Text;