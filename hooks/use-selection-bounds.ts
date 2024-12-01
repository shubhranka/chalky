import { Layer, XYWH } from "@/types";
import { shallow, useStorage } from "@liveblocks/react";
import { useSelf } from "@liveblocks/react/suspense";
import { join } from "path";

const boundingBox = (layers: Layer[]): XYWH | null => {
    const first = layers[0];
    if (!first) return null;

    let x = first.position.x;
    let y = first.position.y;
    let w = x+first.size.x;
    let h = y+first.size.y;


    for(const layer of layers){
        if (layer.position.x < x) x = layer.position.x;
        if (layer.position.y < y) y = layer.position.y;
        if (layer.position.x + layer.size.x > w) w = layer.position.x + layer.size.x;
        if (layer.position.y + layer.size.y > h) h = layer.position.y + layer.size.y;
    }

    return {x,y,w,h};
}

export const useSelectionBounds = () => {
    const selection = useSelf(me => me.presence.selection);

    return useStorage(storage => {
        const layers = selection.map(layerId => storage.layers.get(layerId)).filter(Boolean) as Layer[];
        return boundingBox(layers);
    },shallow);
}