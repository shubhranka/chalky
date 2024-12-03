import { Layer, XYWH } from "@/types";
import { shallow, useStorage } from "@liveblocks/react";
import { useSelf } from "@liveblocks/react/suspense";

const boundingBox = (layers: Layer[]): XYWH | null => {
    const first = layers[0];
    if (!first) return null;

    console.log(layers);

    let x = first.position.x;
    let y = first.position.y;
    let w = first.size.x;
    let h = first.size.y;

    let tox = x + w;
    let toy = y + h;


    for(const layer of layers){
        const layerx = layer.position.x;
        const layery = layer.position.y;
        const layertox = layer.position.x + layer.size.x;
        const layertoy = layer.position.y + layer.size.y;

        if(layerx < x) x = layerx;
        if(layery < y) y = layery;
        if(layertox > tox) tox = layertox;
        if(layertoy > toy) toy = layertoy;
    }

    w = tox - x;
    h = toy - y;

    return {x,y,w,h};
}

export const useSelectionBounds = () => {
    const selection = useSelf(me => me.presence.selection);

    return useStorage(storage => {
        const layers = selection.map(layerId => storage.layers.get(layerId)).filter(Boolean) as Layer[];
        return boundingBox(layers);
    },shallow);
}