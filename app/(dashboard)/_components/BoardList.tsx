"use client";

import { Button } from "@/components/ui/button";
import FavouriteBoard from "./FavouriteBoard";
import ImageWithDownTitle from "./ImageWithDownTitle";
import SearchBoards from "./SearchBoards";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/clerk-react";
import { useApiMutation } from "@/hooks/api-mutation";
import { toast } from "sonner";
import BoardCard from "../board-card/BoardCard";
import NewBoardButton from "./NewBoardButton";

interface BoardListProps {
  searchParams: {
    search: string;
    favourite: boolean;
  };
}

const BoardList = ({ searchParams }: BoardListProps) => {
  // const createBoard = useApiMutation(api.board.create)
  const { mutate, pending } = useApiMutation(api.board.create);
  const { organization } = useOrganization();

  if (!organization) throw new Error("Organization not found");
  const boards = useQuery(api.boards.get, { orgId: organization.id, 
    favorite: Boolean(searchParams.favourite),
    search: searchParams.search
   });
  if (boards == undefined) {
    return "Loading...";
  }

  const handleClick = async () => {
    if (!organization) return;
    try {
      await mutate({
        title: "New Board",
        orgId: organization.id,
      });
      toast.success("Board Created Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create board");
    }
  };

  if (Boolean(searchParams.favourite) && boards.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
          <ImageWithDownTitle src={"/emptyFavourites.png"} title={"No Favourite Board Found"}/>
      </div>
  )
  }

  if (searchParams.search && boards.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
          <ImageWithDownTitle src={"/no-results-found.png"} title={"No Results Found"}/>
      </div>
  )
  }

  if (boards.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <ImageWithDownTitle
          src={"/noData.png"}
          title={"Create your First Board"}
        />

        <h2 className="text-muted-foreground text-sm mt-2">
          Start by creating your first board
        </h2>

        <div className="mt-3">
          <Button disabled={pending} onClick={handleClick} size={"lg"}>
            {!pending ? "Create Board" : "Creating Board"}
          </Button>
        </div>
      </div>
    );
  }

  // if (Boolean(searchParams.favourite)) {
  //   return <FavouriteBoard data={boards} searchParams={searchParams} />;
  // }

  return (
    <div className="h-full">
      {/* <FavouriteBoard data={boards} searchParams={searchParams} />
      <SearchBoards data={boards} searchParams={searchParams} /> */}
      
      
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4
                            xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10"
      >
        {!Boolean(searchParams.favourite) && <NewBoardButton createBoard={handleClick} pending={pending} />}
        {pending && <BoardCard.Skeleton />}
        {boards.map((board: any) => {
          return (
            <BoardCard
              key={board._id}
              id={board._id}
              title={board.title}
              createdAt={board._creationTime}
              authorId={board.authorId}
              authorName={board.authorName}
              imageUrl={board.imageUrl}
              isFavorite={board.isFavorite}
              orgId={board.orgId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BoardList;
