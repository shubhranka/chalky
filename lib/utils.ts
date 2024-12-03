import { Camera, Point, Side, XYWH } from "@/types"
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