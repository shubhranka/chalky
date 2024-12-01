import { LoaderIcon } from "lucide-react";
import Info, { InfoSkeleton } from "./Info";
import Participents, { ParticipentsSkeleton } from "./Participents";
import Toolbar from "./Toolbar";

export default function Loader(){
    return (
        <main className="h-full w-full realtive bg-neutral-100 flex flex-col items-center justify-center">
            <LoaderIcon size={64}  className="animate-spin text-primary-500 duration-[2s]" />
            <InfoSkeleton />
            <ParticipentsSkeleton />
            <Toolbar.Skeleton />
        </main>
    )
}