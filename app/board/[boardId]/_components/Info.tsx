"use client"

import Hint from "@/app/(dashboard)/_components/Hint";
import Actions from "@/components/actions";
import TabSeperator from "@/components/tabseperator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/store/use-rename-modal";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface InfoProps {
  boardId: string;
}

const Info = (
  { boardId }: InfoProps
) => {

  const board = useQuery(api.board.getBoard, { id: boardId as Id<"boards"> });

  const {onRename} = useRenameModal();

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 py-1.5 flex items-center shadow-md box-border">
      {!board && <Skeleton className="w-72 h-12" />}
      {board && 
        <div className="flex flex-row items-center justify-center cursor-pointe h-full w-full rounded-sm " >
        <Hint content="Go back to Dashboard">
          <Link href={`/`} className="h-full flex flex-row items-center justify-center p-2 hover:bg-gray-200 rounded-sm">
            <Image src={"/logo.svg"} width={40} height={40} alt="logo" />
            <span className="text-lg font-bold ml-2">Chalky</span>
          </Link>
        </Hint>
        <TabSeperator/>
        <Hint content="Rename Board">
          <button onClick={()=>{
            onRename(board._id,board.title);
          }} className="h-full flex flex-row items-center justify-center p-2 hover:bg-gray-200 rounded-sm">
            <span className="text-md font-normal">{board.title}</span>
          </button>
        </Hint>
        <TabSeperator/>
        <Actions id={board._id} title={board.title} side="bottom" sideOffset={10}>
          <Menu size={24} className="h-8 w-8 p-2 hover:bg-gray-200 rounded-sm cursor-pointer"/>
        </Actions>
        </div>
      }
    </div>
  );
};

export default Info;

export function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 py-1.5 h-12 flex flex-row items-center justify-center shadow-md w-72">
      <Skeleton className="w-full h-full" />
    </div>
  );
}