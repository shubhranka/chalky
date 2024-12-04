import { Point } from "@/types";

interface SelectionNetLayerProps {
    from: Point
    to: Point
}

const SelectionNetLayer = (
  { from, to }: SelectionNetLayerProps
) => {

    const actualX = Math.min(from.x, to.x);
    const actualY = Math.min(from.y, to.y);
    const actualWidth = Math.abs(from.x - to.x);
    const actualHeight = Math.abs(from.y - to.y);
  return (
    <rect
      x={actualX}
      y={actualY}
      width={actualWidth}
      height={actualHeight}
      className="fill-red-200"
      stroke="red"
      strokeWidth={0.5}
    />
  );
};

export default SelectionNetLayer;