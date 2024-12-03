import { Color } from "@/types";
import { memo } from "react";

interface ColorPickerProps {
    onPickColor: (color: Color) => void
}

const ColorPicker = memo((
    {onPickColor}: ColorPickerProps
) => {

    const SHOWN_COLORS = 4; 
    const colors = []
    for(let i = 0; i < SHOWN_COLORS; i++){
        const color: Color = {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255),
        }
        colors.push(color)
    }
    colors.push({
        r:255,
        g:255,
        b:255
    })

  return (
    <div className="flex gap-x-2">
      {colors.map((color, index) => (
        <div key={index} className="w-6 h-6 rounded-md border border-black cursor-pointer" 
        onClick={() => onPickColor(color)}
         style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}></div>
      ))}
    </div>
  );
});

ColorPicker.displayName = "ColorPicker";

export default ColorPicker;