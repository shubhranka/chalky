import { Room } from "@/app/Room";
import Canvas from "./_components/Canvas";
import Loader from "./_components/Loader";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
}

export default function BoardIdPage (
    { params: { boardId } }: BoardIdPageProps
){
    return (
        <Room roomId={boardId} fallback={<Loader/>}>
            <Canvas boardId={boardId} />
        </Room>
    )
}