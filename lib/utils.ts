import { Camera, Point } from "@/types"
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

const pointerEventToCanvasPoint = (camera: Camera, e: PointerEvent): Point => {
  const rect = (e.target as HTMLElement).getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) / camera.scale + camera.x,
    y: (e.clientY - rect.top) / camera.scale + camera.y,
  };
}