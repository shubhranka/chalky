"use client"

import { Button } from "@/components/ui/button";
import FavouriteBoard from "./FavouriteBoard";
import ImageWithDownTitle from "./ImageWithDownTitle";
import SearchBoards from "./SearchBoards";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/clerk-react";
import { useApiMutation } from "@/hooks/api-mutation";
import { toast } from "sonner";

interface BoardListProps {
    searchParams: {
        search: string;
        favourite: boolean;
    }
}

const data : any = []

const BoardList = ({searchParams} : BoardListProps) => {
    // const createBoard = useApiMutation(api.board.create)
    const {mutate, pending} = useApiMutation(api.board.create)
    const {organization} = useOrganization()

    const handleClick = async () => {
        if (!organization) return;
        try {
            await mutate({
                title: "New Board",
                orgId: organization.id
            })
            toast.success("Board Created Successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to create board")
        }
    }
    return (
        <div className="h-full">
            <FavouriteBoard data={data} searchParams={searchParams}/>
            <SearchBoards data={data} searchParams={searchParams}/>
            {data.length === 0 && 
                    <div className="h-full w-full flex flex-col items-center justify-center">
                        <ImageWithDownTitle src={"/noData.png"} title={"Create your First Board"}/>
        
                        <h2 className="text-muted-foreground text-sm mt-2">
                            Start by creating your first board
                        </h2>

                        <div className="mt-3">
                            <Button disabled={pending} onClick={handleClick} size={"lg"}>
                                {!pending ? "Create Board" : "Creating Board"}
                            </Button>
                        </div>
                    </div>
            }
            </div>
    );
}

export default BoardList;