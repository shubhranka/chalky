import { useOthersConnectionIds } from "@liveblocks/react/suspense";
import { MousePointer2 } from "lucide-react";
import Cursor from "./Cursor";

const Cursors = () => {
    const ids = useOthersConnectionIds();

    return (
        <>
            {ids.map((id) => (
               <Cursor key={id} connectionId={id} />
            ))}
        </>
    )
}

const CursorPresence = () => {

    return(
        <>
            <Cursors />
        </>
    )
};

export default CursorPresence;