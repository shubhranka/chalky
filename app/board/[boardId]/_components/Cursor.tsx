import { getUserColor } from "@/lib/utils";
import { useOther } from "@liveblocks/react/suspense";
import { MousePointer2 } from "lucide-react";
import { memo, useMemo } from "react";

interface CursorProps {
    connectionId: number;
}

const Cursor = memo((
    {connectionId}: CursorProps
) => {

    const info = useOther(connectionId, user => user.info);
    const cursorPosition = useOther(connectionId, user => user.presence.cursor);

    const color = useMemo(() => getUserColor(connectionId), [connectionId]);

    if (!info || cursorPosition.x < 0) {
        return null;
    }

  return (
    <foreignObject style={{
        transform: `translate(${cursorPosition?.x}px, ${cursorPosition?.y}px)`,
    }}
        width={info?.name?.length || 0 * 10 + 24 }
        height={24}
        className=" drop-shadow-lg relative"
    >
        <MousePointer2 key={connectionId} 
        fill={color}
        color={color}
        className={`
            h-5 w-5
        `}/>
        <p className="text-xs text-black absolute top-0 left-6 w-full h-full">{info?.name}</p>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";

export default Cursor;