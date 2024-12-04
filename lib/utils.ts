import { Camera, Color, Layer, Point, Side, XYWH } from "@/types"
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
  return {
    x: ((e.clientX) - camera.x) /camera.scale   ,
    y: ((e.clientY) - camera.y) /camera.scale   ,
  };
  // return {
  //   x: (e.clientX) / 1 - camera.x,
  //   y: (e.clientY) / 1 - camera.y,
  // };
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

export function getTextColor({r, g, b}: Color) {
  // Ensure values are within 0-255 range
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  // Calculate luminance using the relative luminance formula
  const rLinear = r / 255;
  const gLinear = g / 255;
  const bLinear = b / 255;
  
  const rAdjusted = rLinear <= 0.03928 
      ? rLinear / 12.92 
      : Math.pow((rLinear + 0.055) / 1.055, 2.4);
  
  const gAdjusted = gLinear <= 0.03928 
      ? gLinear / 12.92 
      : Math.pow((gLinear + 0.055) / 1.055, 2.4);
  
  const bAdjusted = bLinear <= 0.03928 
      ? bLinear / 12.92 
      : Math.pow((bLinear + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  const luminance = 0.2126 * rAdjusted + 0.7152 * gAdjusted + 0.0722 * bAdjusted;
  
  // Choose text color based on luminance
  return luminance < 0.5 ? '#FFFFFF' : '#000000';
}

export function pointsToSvgPath(points: Point[], options?: {
  closePath?: boolean;
  moveToFirst?: boolean;
}) {
  // Handle empty array case
  if (points.length === 0) {
    return {
      pathString: '',
      width: 0,
      height: 0,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
  }

  // Default options
  const {
    closePath = false,
    moveToFirst = true
  } = options || {};

  // Calculate min and max coordinates
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  // Calculate width and height
  const width = maxX - minX;
  const height = maxY - minY;

  // Create the path commands
  const pathCommands = points.map((point, index) => {
    if (index === 0 && moveToFirst) {
      // First point uses moveTo
      return `M${point.x} ${point.y}`;
    }
    // Subsequent points use lineTo
    return `L${point.x} ${point.y}`;
  });

  // Close the path if requested
  if (closePath) {
    pathCommands.push('Z');
  }

  // Join the commands into a single path string
  const pathString = pathCommands.join(' ');

  return {
    pathString,
    width,
    height,
    minX,
    minY,
    maxX,
    maxY
  };
}

// Cubic Bézier Curve Interpolation
export function smoothPathBezier(points: Point[], tension: number = 0.3): string {
  if (points.length < 2) return '';
  
  // If only two points, create a simple line
  if (points.length === 2) {
    return `M${points[0].x} ${points[0].y} L${points[1].x} ${points[1].y}`;
  }

  let pathCommands: string[] = [`M${points[0].x} ${points[0].y}`];

  for (let i = 1; i < points.length - 1; i++) {
    const prevPoint = points[i - 1];
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    // Calculate control points
    const controlPoint1X = currentPoint.x - (nextPoint.x - prevPoint.x) * tension;
    const controlPoint1Y = currentPoint.y - (nextPoint.y - prevPoint.y) * tension;

    const controlPoint2X = nextPoint.x + (nextPoint.x - prevPoint.x) * tension;
    const controlPoint2Y = nextPoint.y + (nextPoint.y - prevPoint.y) * tension;

    pathCommands.push(
      `C${controlPoint1X} ${controlPoint1Y}, ` +
      `${controlPoint2X} ${controlPoint2Y}, ` +
      `${nextPoint.x} ${nextPoint.y}`
    );
  }

  return pathCommands.join(' ');
}

// Cardinal Spline Interpolation
export function smoothPathCardinal(points: Point[], tension: number = 0.5): string {
  if (points.length < 2) return '';
  
  // If only two points, create a simple line
  if (points.length === 2) {
    return `M${points[0].x} ${points[0].y} L${points[1].x} ${points[1].y}`;
  }

  function getControlPoints(p0: Point, p1: Point, p2: Point, p3: Point, t: number) {
    const d1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
    const d2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const d3 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));

    const fa = t * d1 / (d1 + d2);
    const fb = t * d2 / (d1 + d2);
    const fc = t * d2 / (d2 + d3);
    const fd = t * d3 / (d2 + d3);

    const p1x = p1.x + fa * (p2.x - p0.x);
    const p1y = p1.y + fa * (p2.y - p0.y);
    const p2x = p2.x - fb * (p3.x - p1.x);
    const p2y = p2.y - fb * (p3.y - p1.y);

    return {
      control1: { x: p1x, y: p1y },
      control2: { x: p2x, y: p2y }
    };
  }

  let pathCommands: string[] = [`M${points[0].x} ${points[0].y}`];

  for (let i = 1; i < points.length - 2; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const { control1, control2 } = getControlPoints(p0, p1, p2, p3, tension);

    pathCommands.push(
      `C${control1.x} ${control1.y}, ` +
      `${control2.x} ${control2.y}, ` +
      `${p2.x} ${p2.y}`
    );
  }

  return pathCommands.join(' ');
}

export function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';

  // Start with move to first point
  let pathString = `M ${points[0].x} ${points[0].y}`;

  // For very few points, just create a simple line
  if (points.length === 2) {
    return `${pathString} L ${points[1].x} ${points[1].y}`;
  }

  // Use smooth cubic Bézier curve (S command)
  for (let i = 1; i < points.length; i++) {
    // Calculate smooth control points
    const prevPoint = points[i - 1];
    const currentPoint = points[i];

    // Reflect the last control point (simplified smooth curve)
    const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) / 2;
    const controlY = prevPoint.y + (currentPoint.y - prevPoint.y) / 2;

    pathString += ` S ${controlX} ${controlY}, ${currentPoint.x} ${currentPoint.y}`;
  }

  return pathString;
}

export function createDimensionsPath(points: { x: number; y: number }[]): XYWH {
  const { minX, minY, maxX, maxY } = points.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxX: Math.max(acc.maxX, point.x),
      maxY: Math.max(acc.maxY, point.y),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );
  const width = maxX - minX;
  const height = maxY - minY;
  return { x: minX, y: minY, w: width, h: height };
}

export function movePointsCloserToOrigin(points: { x: number; y: number }[], origin: Point): Point[] {
  return points.map(point => ({
    x: point.x - origin.x,
    y: point.y - origin.y,
  }));
}

export function getSvgPathFromStroke(stroke:any) {
  if (!stroke.length) return ''

  const d = stroke.reduce(
    (acc:any, [x0, y0] :any, i:any, arr:any) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')
  return d.join(' ')
}