"use client";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  Layer,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types";
import Info from "./Info";
import Participents from "./Participents";
import Toolbar from "./Toolbar";
import React, { useCallback, useMemo, useState } from "react";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useRedo,
  useUndo,
} from "@liveblocks/react";
import CursorPresence from "./CursorPresence";
import {
  useOthersMapped,
  useSelf,
  useStorage,
} from "@liveblocks/react/suspense";
import LayerElement from "./LayerElement";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import {
    findIntersectingLayers,
  getUserColor,
  pointerEventToCanvasPoint,
  resizeLayer,
  translateLayer,
} from "@/lib/utils";
import SelectionBox from "./SelectionBox";
import LayerTools from "./LayerTools";
import SelectionNetLayer from "./SelectionNetLayer";

interface CanvasProps {
  boardId: string;
}

const MAX_LAYERS = 100;

export default function Canvas({ boardId }: CanvasProps) {
  const self = useSelf();
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
    scale: 1,
  });



  const checkForSelectionNet = useCallback((origin: Point, position: Point) => {
    const dx = Math.abs(origin.x - position.x);
    const dy = Math.abs(origin.y - position.y);
    if (dx > 5 || dy > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        position,
      });
    }
  },[])

  const updateSelectionNet = useMutation(({ storage, setMyPresence }, origin: Point, position: Point) => {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin: origin,
        position,
      });

      const layers = storage.get("layers").toImmutable();

      const layersInSelection = findIntersectingLayers(layers, origin, position);
      const layerIds = layersInSelection.map(layer => layer.id);
      
      setMyPresence(
        {selection:[...layerIds]}
      )
  },[])

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const point = pointerEventToCanvasPoint(camera, e);
      if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(point);
      }
      else if(canvasState.mode === CanvasMode.Pressing){
        checkForSelectionNet(canvasState.origin, point);
      }
      else if(canvasState.mode === CanvasMode.SelectionNet){
          updateSelectionNet(canvasState.origin, point);
      }
      else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(point);
      }
      setMyPresence({
        cursor: point,
      });
    },
    [canvasState,
      canvasState.mode,
      camera
    ]
  );

  const translateSelectedLayer = useMutation(
    ({ storage }, p: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;
      const liveLayers = storage.get("layers");
      const newPostion = translateLayer(p, canvasState.position!);
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (!layer) continue;
        layer.update({
          position: {
            x: layer.get("position").x + newPostion.x,
            y: layer.get("position").y + newPostion.y,
          },
        });
      }
      setCanvasState({
        mode: CanvasMode.Translating,
        position: p,
      });
    },
    [canvasState, self.presence.selection, camera]
  );

  const resizeSelectedLayer = useMutation(
    ({ storage }, p: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;
      const layerId = self.presence.selection[0];
      if (!layerId) return;
      const layer = storage.get("layers").get(layerId);
      if (!layer) return;
      const bounds = canvasState.initialBounds;
      const neBounds = resizeLayer(canvasState.side, bounds, p);


      layer.update({
        position: { x: neBounds.x, y: neBounds.y },
        size: { x: neBounds.w, y: neBounds.h },
      });
    },
    [canvasState, self.presence.selection]
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({
      cursor: {
        x: -1,
        y: -1,
      },
    });
  }, []);
  const [lastColor, setLastColor] = useState<Color>({ r: 0, g: 0, b: 0, a: 1 });
  const onInsertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Pencil
        | LayerType.Text
        | LayerType.Sticky,
      position: Point
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
        size: { x: 100, y: 100 },
        rotation: 0,
      } as Layer);

      storage.get("layerIds").push(layerId);
      storage.get("layers").set(layerId, layer);
      setMyPresence(
        {
          selection: [layerId],
        },
        { addToHistory: true }
      );

      setCanvasState({
        mode: CanvasMode.None,
      });
    },
    [lastColor, camera]
  );
  const history = useHistory();

  const deselectLayer = useMutation(({ setMyPresence }) => {
    setMyPresence(
      {
        selection: [],
      },
      { addToHistory: true }
    );
    setCanvasState({
      mode: CanvasMode.None,
    })
  }, []);
  const onMouseUp = useMutation(
    ({}, e) => {
      if (
        canvasState.mode === CanvasMode.Pressing ||
        canvasState.mode === CanvasMode.None
      ) {
        deselectLayer();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        const point = pointerEventToCanvasPoint(camera, e);
        onInsertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }
      history.resume();
    },
    [canvasState, onInsertLayer, history, deselectLayer, camera]
  );

  const redo = useRedo();
  const undo = useUndo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const layerIds = useStorage((storage) => storage.layerIds) || [];

  const selections = useOthersMapped((others) => others.presence.selection);

  const selectedLayerIdMappedColor = useMemo(() => {
    const selectedLayerIdMappedColor: Record<string, string> = {};
    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        selectedLayerIdMappedColor[layerId] = getUserColor(connectionId);
      }
    }
    return selectedLayerIdMappedColor;
  }, [selections]);
  const onPointerPress = useMutation(
    ({ setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Pencil
      )
        return;
      const point = pointerEventToCanvasPoint(camera, e);
      history.pause();
      e.stopPropagation();

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence(
          {
            selection: [layerId],
          },
          { addToHistory: true }
        );
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        position: point,
      });
    },
    [self.presence.selection, canvasState, history, camera, canvasState.mode]
  );

  const onResizeHandler = useCallback(
    (e: React.PointerEvent, corner: Side, bounds: XYWH) => {
        e.preventDefault();
        e.stopPropagation();
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Pencil
      )
        return;
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds: bounds,
        side: corner,
      });
    },
    [canvasState, history, setCanvasState]
  );

  const onTranslateHandler = useCallback(
    (e: React.PointerEvent) => {
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Pencil
      )
        return;
      history.pause();
      const origin = pointerEventToCanvasPoint(camera, e);
      setCanvasState({
        mode: CanvasMode.Translating,
        position: origin,
      });
    },
    [canvasState, history, camera]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(camera, e);

      if (canvasState.mode === CanvasMode.Inserting
        || canvasState.mode === CanvasMode.Resizing
      ) {
        return;
      }

      setCanvasState({
        mode: CanvasMode.Pressing,
        origin: point,
      });
    },
    [canvasState, camera, setCanvasState]
  );

  const onWheelHandler = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const scale = camera.scale - e.deltaY * 0.001;
      camera.scale = Math.max(0.1, scale);

      setCamera(camera);
    },
    [camera]
  );

  const onHandleColorPick = useMutation(
    ({ storage }, color: Color) => {
      const selectedLayers = self.presence.selection;
      for (const layerId of selectedLayers) {
        const layer = storage.get("layers").get(layerId);
        if (!layer) continue;
        if (layer.get("type") === LayerType.Pencil) continue;
        layer.set("fill", color);
      }
      setLastColor(color);
    },
    [self.presence.selection, lastColor, setLastColor]
  );

  const onDeleteLayer = useMutation(
    ({ storage, setMyPresence }) => {
        const selectedLayers = self.presence.selection;
        const layers = storage.get("layers");
        for (const layerId of selectedLayers) {
            layers.delete(layerId);
        }
      setMyPresence(
        {
          selection: [],
        },
        { addToHistory: true }
      );
    },
    [self.presence.selection]
  );

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
      <LayerTools
        camera={camera}
        lastUsedColor={lastColor}
        setLastUsedColor={onHandleColorPick}
        deleteLayer={onDeleteLayer}
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onMouseUp}
        // onWheel={onWheelHandler}
      >
        <g
          transform={`translate(${camera.x},${camera.y}) scale(${camera.scale})`}
        >
        {canvasState.mode === CanvasMode.SelectionNet && (
            <SelectionNetLayer from={canvasState.origin} to={canvasState.position!} />
        )}
          {layerIds.map((layerId) => (
            <LayerElement
              onLayerPointerDown={onPointerPress}
              key={layerId}
              layerId={layerId}
              selectionColor={selectedLayerIdMappedColor[layerId]}
            />
          ))}
          <SelectionBox
            onResizeHandler={onResizeHandler}
            onTranslateHandler={onTranslateHandler}
          />
          <CursorPresence />
        </g>
      </svg>
    </div>
  );
}
