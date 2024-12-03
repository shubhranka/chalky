import { Camera, Layer, Point, Side, XYWH } from "@/types"
import { LiveMap, LiveObject } from "@liveblocks/client"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Use bright colors for user avatars
export const userColors = [
  "green",
  "blue",
  "purple",
  "orange",
  "red",
]

export function getUserColor(connectionId: number) {
  const index = connectionId % userColors.length
  return userColors[index]
  // return 
}

export const pointerEventToCanvasPoint = (camera: Camera, e: React.PointerEvent): Point => {
  const rect = (e.target as HTMLElement).getBoundingClientRect();
  return {
    x: (e.clientX) / camera.scale + camera.x,
    y: (e.clientY) / camera.scale + camera.y,
  };
}

export const resizeLayer = (corner: Side, initialBounds: XYWH, p: Point) => {
  const bounds = { ...initialBounds };

  if (corner == (Side.Left | Side.Top)) {
    bounds.x = p.x;
    bounds.y = p.y;
    bounds.w = initialBounds.x + initialBounds.w - bounds.x;
    bounds.h = initialBounds.y + initialBounds.h - bounds.y;
  }
  if (corner == (Side.Right | Side.Top)) {
    bounds.w = p.x - initialBounds.x;
    bounds.y = p.y;
    bounds.h = initialBounds.y + initialBounds.h - bounds.y;
  }
  if (corner == (Side.Left | Side.Bottom)) {
    bounds.x = p.x;
    bounds.h = p.y - initialBounds.y;
    bounds.w = initialBounds.x + initialBounds.w - bounds.x;
  }
  if (corner == (Side.Right | Side.Bottom)) {
    bounds.w = p.x - initialBounds.x;
    bounds.h = p.y - initialBounds.y;
  }

  if(corner == Side.Left) {
    bounds.x = p.x;
    bounds.w = initialBounds.x + initialBounds.w - bounds.x;
  }
  if(corner == Side.Right) {
    bounds.w += p.x - (initialBounds.x + initialBounds.w);
  }
  if(corner == Side.Top) {
    bounds.y = p.y;
    bounds.h = initialBounds.y + initialBounds.h - bounds.y;
  }
  if(corner == Side.Bottom) {
    bounds.h = p.y - initialBounds.y;
  }
  return bounds;
}

export const translateLayer = (position: Point, mousePoint: Point): Point => {
  return {
    x: position.x - mousePoint.x,
    y: position.y - mousePoint.y,
  }
}


export const findIntersectingLayers = (layers: ReadonlyMap<string, Layer>, from: Point, to: Point) => {
  // return layers.filter(layer => {
  //   return (layer.position.x < to.x && layer.position.x + layer.size.x > from.x) &&
  //     (layer.position.y < to.y && layer.position.y + layer.size.y > from.y)
  // })

  return Array.from(layers.values()).filter(layer => {

    if (from.x > to.x && from.y > to.y) {
      return (layer.position.x < from.x && layer.position.x + layer.size.x > to.x) &&
        (layer.position.y < from.y && layer.position.y + layer.size.y > to.y)
    }

    if (from.x < to.x && from.y < to.y) {
      return (layer.position.x < to.x && layer.position.x + layer.size.x > from.x) &&
        (layer.position.y < to.y && layer.position.y + layer.size.y > from.y)
    }

    if (from.x < to.x && from.y > to.y) {
      return (layer.position.x < to.x && layer.position.x + layer.size.x > from.x) &&
        (layer.position.y < from.y && layer.position.y + layer.size.y > to.y)
    }

    if (from.x > to.x && from.y < to.y) {
      return (layer.position.x < from.x && layer.position.x + layer.size.x > to.x) &&
        (layer.position.y < to.y && layer.position.y + layer.size.y > from.y)
    }
  })

}