"use client"
import { Camera, CanvasMode, CanvasState, Color, Layer, LayerType, Point } from "@/types";
import Info from "./Info";
import Participents from "./Participents";
import Toolbar from "./Toolbar";
import React, { useMemo, useState } from "react";
import { useCanRedo, useCanUndo, useHistory, useMutation, useRedo, useUndo } from "@liveblocks/react";
import CursorPresence from "./CursorPresence";
import {useOthersMapped, useSelf, useStorage } from "@liveblocks/react/suspense";
import LayerElement from "./LayerElement";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { getUserColor, pointerEventToCanvasPoint } from "@/lib/utils";

interface CanvasProps {
    boardId: string;
}

const MAX_LAYERS = 100;

export default function Canvas (
    { boardId }: CanvasProps
) {
    const self = useSelf();
    const camera : Camera = {
        x: 0,
        y: 0,
        scale: 1,
    };
    const onPointerMove = useMutation(({setMyPresence}, e: React.PointerEvent) => {
        e.preventDefault();
        setMyPresence({
            cursor: {
                x: e.clientX,
                y: e.clientY
            }
        });
    },[]);
    const onPointerLeave = useMutation(({setMyPresence}) => {
        setMyPresence({
            cursor: {
                x: -1,
                y: -1
            }
        });
    },[]);
    const [lastColor, setLastColor] = useState<Color>({r: 0, g: 0, b: 0, a: 1});
    const onInsertLayer = useMutation(({storage, setMyPresence},
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Pencil | LayerType.Text | LayerType.Sticky,
        position: Point,
    ) => {
        if (storage.get("layerIds").length >= MAX_LAYERS) {
            return;
        }
        const layerId = nanoid();
        const layer = new LiveObject({
            type: layerType,
            id: layerId,
            fill: lastColor,
            stroke: lastColor,
            position,
            size: {x: 100, y: 100},
            rotation: 0,
        } as Layer);

        storage.get("layerIds").push(layerId);
        storage.get("layers").set(layerId, layer);
        setMyPresence({
            selection: [layerId],
        }, {addToHistory: true});

        setCanvasState({
            mode: CanvasMode.None,
        })
    }, [lastColor]);
    const history = useHistory();
    const [canvasState, setCanvasState] = useState<CanvasState>({mode: CanvasMode.None});

    const onMouseUp = useMutation(({},e) => {
        if (canvasState.mode === CanvasMode.Inserting) {
            const point = pointerEventToCanvasPoint(camera, e);
            onInsertLayer(canvasState.layerType, point);
        }else{
            setCanvasState({
                mode: CanvasMode.None,
            });
        }
        history.resume();
    }, [canvasState,
        onInsertLayer,
        history
    ]);
    
    const redo = useRedo();
    const undo = useUndo();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const layerIds = useStorage(storage => storage.layerIds) || [];

    const selections = useOthersMapped(others => others.presence.selection);

    const selectedLayerIdMappedColor = useMemo(() => {
        const selectedLayerIdMappedColor: Record<string, string> = {};
        // selections.forEach((selection, connectionId) => {
        //     for (const layerId of selection)
        //         selectedLayerIdMappedColor[layerId] = getUserColor(connectionId);
        // });
        for (const user of selections) {
            const [connectionId, selection] = user;

            for (const layerId of selection) {
                selectedLayerIdMappedColor[layerId] = getUserColor(connectionId);
            }
        }
        console.log(selectedLayerIdMappedColor);
        return selectedLayerIdMappedColor;
    },[selections]);
    const onPointerPress = useMutation(({setMyPresence}, e: PointerEvent, layerId: string) => {

        if (canvasState.mode === CanvasMode.Inserting ||
            canvasState.mode === CanvasMode.Pencil) 
            return;
        const point = pointerEventToCanvasPoint(camera, e);
        history.pause();
        e.stopPropagation();

        if (!self.presence.selection.includes(layerId)) {
            setMyPresence({
                selection: [layerId],
            }, {addToHistory: true});
        }

        setCanvasState({
            mode: CanvasMode.Translating,
            position: point,
        });
    
    }, [
        self.presence.selection,
        canvasState,
        history,
        camera,
        canvasState.mode
    ]);


    return (
        <div className="h-full w-full realtive bg-neutral-100">
            <Info boardId={boardId} />
            <Participents />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                redo={redo}
                undo={undo}
                canUndo={canUndo}
                canRedo={canRedo}
            />
            <svg className="h-[100vh] w-[100vw]"
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onMouseUp}
                >
                <g>
                    {layerIds.map(layerId => (
                        <LayerElement onLayerPointerDown={onPointerPress} key={layerId} layerId={layerId} selectionColor={selectedLayerIdMappedColor[layerId]} />
                    ))}
                    <CursorPresence />
                </g>
            </svg>
        </div>
    )
}
