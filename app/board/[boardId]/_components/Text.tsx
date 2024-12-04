import { getTextColor } from "@/lib/utils";
import { LayerType, NoteLayer, TextLayer } from "@/types";
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
    layer: TextLayer | NoteLayer
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

    const [textContent, setTextContent] = useState(layer.value);

    const updateText = useMutation(({storage}, value) => {
        const textLayer = storage.get("layers").get(id)
        textLayer?.set("value", value)
    },[]);

    const deboundedUpdateText = debounce(updateText, 500);

    const debouncedUpdateText = (e: ContentEditableEvent) => {
        const value = e.target.value;
        setTextContent(value);
        deboundedUpdateText(value);
    }  

    return <foreignObject 
        x={layer.position.x}
        y={layer.position.y}
        width={layer.size.x}
        height={layer.size.y}
        onPointerDown={(e)=> onPointerDown(e,id)}
        style={{
            outline: selectionColor ? `1px solid ${selectionColor}` : "none",
            ...(layer.type === LayerType.Sticky) ? {
                backgroundColor: `rgb(${layer.fill.r},${layer.fill.g},${layer.fill.b})`,
            }: {}
        }}
        className={`
            ${layer.type === LayerType.Sticky ? "shadow-xl flex flex-col items-center justify-center rounded-lg" : ""}
            `}
        >
        <ContentEditable
            html={textContent || "text"}
            onChange={(e)=>debouncedUpdateText(e)}
            style={{
                fontFamily: font.style.fontFamily,
                // fontSize: layer.size.y * 0.6,
                fontSize: layer.fontSize || 16,
                transform: `rotate(${layer.rotation}deg)`,
                ...(layer.type === LayerType.Sticky) ? {
                    color: getTextColor(layer.fill),
                } : {
                    color: `rgb(${layer.fill.r},${layer.fill.g},${layer.fill.b})`,
                }
            }}
            className={`
                ${layer.type === LayerType.Sticky ? "w-full h-full flex items-center justify-center" : ""}
            `}
        />

    </foreignObject>
};

export default Text;