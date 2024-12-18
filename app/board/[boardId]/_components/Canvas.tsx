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
  TextLayer,
  XYWH,
} from "@/types";
import Info from "./Info";
import Participents from "./Participents";
import Toolbar from "./Toolbar";
import React, {useCallback, useEffect, useMemo, useState } from "react";
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
  createDimensionsPath,
    findIntersectingLayers,
  getUserColor,
  movePointsCloserToOrigin,
  pointerEventToCanvasPoint,
  resizeLayer,
  translateLayer,
} from "@/lib/utils";
import SelectionBox from "./SelectionBox";
import LayerTools from "./LayerTools";
import SelectionNetLayer from "./SelectionNetLayer";
import TextLayerTools from "./TextLayerTool";
import { set } from "date-fns";
import Path from "./Path";
import LivePath from "./LIvePath";

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
  const [spacebarPressed, setSpacebarPressed] = useState(false);
  const selectedLayerId = useSelf(me => me.presence.selection?.length == 1 ? me.presence.selection[0] : null);
  const selectedLayer = useStorage(storage => {
    if (!selectedLayerId) return null;
    return storage.layers.get(selectedLayerId);
  })



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

  const throttle = ( delay: number) => {
    let lastCall :any = 0;
    return (camera:Camera, point: Point) => {
      const now = Date.now();
      if (now - lastCall < delay) {
        clearTimeout(lastCall);
      }
      lastCall = setTimeout(() => {
        setCamera(camera);
        setCanvasState({
          mode: CanvasMode.Pressing,
          origin: point
        })
      }, delay);
    };
  };

  const throttledMoveCamera = throttle(16);


  const moveCamera = useCallback(( originL:Point, point: Point) => {
    const dx = Math.abs(originL.x - point.x);
    const dy = Math.abs(originL.y - point.y);

    if (dx < 5 && dy < 5) 
        return
    throttledMoveCamera({
      x: camera.x + point.x - originL.x,
      y: camera.y + point.y - originL.y,
      scale: camera.scale
    }, point)
  },[camera, throttledMoveCamera])

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const point = pointerEventToCanvasPoint(camera, e);

      if(canvasState.mode === CanvasMode.Drawing){
        continueDrawing(point);
      }
      else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(point);
      }
      else if(canvasState.mode === CanvasMode.Pressing){
        if (spacebarPressed) {
          moveCamera(canvasState.origin,point);
        }else{
          checkForSelectionNet(canvasState.origin, point);
        }
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

      if (layerType === LayerType.Text || layerType === LayerType.Sticky) {
        layer.set("value", "Text");
        (layer as LiveObject<TextLayer>).set("fontSize", 16);
      }

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

  const stopDrawing = useMutation(({ setMyPresence, storage }) => {
    
    const id = nanoid();
    const dimensions = createDimensionsPath(self.presence.drawingPoints);
    const movedPoints = movePointsCloserToOrigin(self.presence.drawingPoints, { x: dimensions.x, y: dimensions.y });
    const layer = new LiveObject({
      type: LayerType.Pencil,
      id,
      fill: lastColor,
      stroke: lastColor,
      position: { x: dimensions.x, y: dimensions.y },
      size: { x: dimensions.w, y: dimensions.h },
      rotation: 0,
      points: movedPoints,
    } as Layer);
    const layers = storage.get("layers");
    layers.set(id, layer);
    storage.get("layerIds").push(id);

    setMyPresence({
      drawingPoints: [],
      drawing: false
    })
    setCanvasState({
      mode: CanvasMode.None
    })
  },[
    lastColor,
    self.presence.drawingPoints
  ])
  const onMouseUp = useMutation(
    ({}, e) => {
      if (canvasState.mode === CanvasMode.Drawing) {
        stopDrawing();
      }
      else if (
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

  const continueDrawing = useMutation(({ setMyPresence }, point: Point) => {
    const drawingPoints = self.presence.drawingPoints;
    drawingPoints.push(point);
    setMyPresence({
      drawingPoints
    })
  },[
    self.presence.drawingPoints,
  ])

  const startDrawing = useMutation(({ setMyPresence }) => {
    setMyPresence({
      drawing: true,
    });
    setCanvasState({
      mode: CanvasMode.Drawing
    })
  },[
    setCanvasState,  
  ])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(camera, e);
      if (canvasState.mode === CanvasMode.Resizing ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }
      if(canvasState.mode === CanvasMode.Pencil){
        startDrawing();
      }
      else{
        setCanvasState({
          mode: CanvasMode.Pressing,
          origin: point,
        });
      }
    },
    [canvasState, camera, setCanvasState, startDrawing]
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

  const onKeyDownHandler = 
    useCallback((e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setSpacebarPressed(true);
      }
    },[setSpacebarPressed]);
  const onKeyUpHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setSpacebarPressed(false);
      }
    },
    [setSpacebarPressed]
  );
  // const [cameraMousePosition, setCameraMousePosition] = useState<Point>({ x: 0, y: 0 });

  // const justToCheckMouseMove = useCallback((e : MouseEvent) => {
  //   const point = pointerEventToCanvasPoint(camera,e as any );
  //   setCameraMousePosition(point);
  // }, [
  //   setCameraMousePosition,
  //   camera,
  // ]);

  
  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
    document.addEventListener("keyup", onKeyUpHandler);
    // document.addEventListener("mousemove", justToCheckMouseMove)
    return () => {
      document.removeEventListener("keydown", onKeyDownHandler);
      document.removeEventListener("keyup", onKeyUpHandler);
    };
  }, [onKeyDownHandler, 
    onKeyUpHandler,
    // justToCheckMouseMove
  ]);

  return (
    <div className="h-full w-full realtive bg-neutral-100 overflow-hidden" style={{
      cursor: spacebarPressed ? "grab" : "auto",
    }}>
      <Info boardId={boardId} />
      <Participents />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        redo={redo}
        undo={undo}
        canUndo={canUndo}
        canRedo={canRedo}
        setCamera={setCamera}
        camera={camera}
      />
      {selectedLayer && (selectedLayer.type === LayerType.Text || selectedLayer.type === LayerType.Sticky) && <TextLayerTools camera={camera} layer={selectedLayer}/>}
      {canvasState.mode !== CanvasMode.SelectionNet && <LayerTools
        camera={camera}
        lastUsedColor={lastColor}
        setLastUsedColor={onHandleColorPick}
        deleteLayer={onDeleteLayer}
      />}
      
      {/* <div className="h-12 w-12 bg-slate-600 absolute" 
        style={{
          transform: `translate(${cameraMousePosition.x + 16}px, ${cameraMousePosition.y + 16}px)`
        }} 
      />
      <div className="h-12 w-12 bg-red-600 absolute" 
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px)`
        }} 
      /> */}

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
          <LivePath color={lastColor} />
          <CursorPresence />
        </g>
      </svg>
    </div>
  );
}
