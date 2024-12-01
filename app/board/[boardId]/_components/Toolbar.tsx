import { Skeleton } from "@/components/ui/skeleton";
import ToolButton from "./ToolButton";
import {
  Circle,
  MousePointer2,
  Pen,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";
import { CanvasMode, CanvasState, LayerType } from "@/types";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  redo: () => void;
  undo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar = ({
  canvasState,
  setCanvasState,
  redo,
  undo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 py-1.5 flex flex-col items-center gap-y-1 shadow-md">
        <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => {
            setCanvasState({ mode: CanvasMode.None });
          }}
          active={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
        />
        <ToolButton
          label="Text"
          icon={Type}
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            });
          }}
          active={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text}
        />
        <ToolButton label="Sticky" icon={StickyNote} 
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Sticky,
            });
          }}
          active={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Sticky}
        />
        <ToolButton label="Square" icon={Square} 
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            });
          }}
          active={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle}
        />
        <ToolButton label="Ellipcis" icon={Circle} 
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse,
            });
          }}
          active={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse}
        />
        <ToolButton label="Pen" icon={Pen}
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.Pencil,
            });
          }}
          active={canvasState.mode === CanvasMode.Pencil}
        />
      </div>

      <div className="bg-white rounded-md p-1.5 flex flex-col items-center gap-y-1 shadow-md">
        <ToolButton
          label="Undo"
          icon={Undo2}
          onClick={undo}
          disabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={redo}
          disabled={!canRedo}
        />
      </div>
    </div>
  );
};

export default Toolbar;

Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center gap-y-1 shadow-md">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-24 h-6" />
      </div>

      <div className="bg-white rounded-md p-1.5 flex flex-col items-center gap-y-1 shadow-md">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-24 h-6" />
      </div>
    </div>
  );
};
