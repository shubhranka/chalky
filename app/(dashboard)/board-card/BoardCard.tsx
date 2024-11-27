import Image from "next/image";
import Link from "next/link";
import Overlay from "./Overlay";
import Footer from "./Footer";
import { useAuth } from "@clerk/clerk-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Actions from "@/components/actions";
import { MoreHorizontalIcon } from "lucide-react";

interface BoardCardProps {
    id: string;
    title: string;
    imageUrl: string;
    authorName: string;
    orgId: string;
    authorId: string;
    isFavorite: boolean;
    createdAt: string;
}

export default function BoardCard(
    { id, title, imageUrl, authorName, orgId, authorId, isFavorite, createdAt }: BoardCardProps
) {
    const {userId} = useAuth();
    const authorLabel = userId === authorId ? "You" : authorName;   

    const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });
    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-white flex-col">
                    <Image
                        src={imageUrl}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        fill
                        className="group-hover:scale-125 transition-transform duration-500"
                    />
                    <Overlay />
                    <Actions 
                        id={id}
                        title={title}
                        side="bottom"                   
                    >
                        <button
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-125 py-2 px-3 outline-none"
                        >
                            <MoreHorizontalIcon className="text-white opacity-75 hover:opacity-100 transition-opacity duration-125" />
                        </button>
                    </Actions>
                </div>
                <Footer
                    title={title}
                    authorLabel={authorLabel}
                    createdAt={createdAtLabel}
                    isFavourite={isFavorite}
                    onClick={() => {}}
                    disabled={false}
                />
            </div>
        </Link>
    );
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full"/>
        </div>
    )
}