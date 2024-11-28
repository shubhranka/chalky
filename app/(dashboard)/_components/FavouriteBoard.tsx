import { useQuery } from "convex/react";
import ImageWithDownTitle from "./ImageWithDownTitle";
import { api } from "@/convex/_generated/api";

interface FavouriteBoardProps {
    searchParams?: {
        favourite?: boolean;
    },
    data: any;
}

const FavouriteBoard = ({searchParams,data} : FavouriteBoardProps) => {
    if(!(searchParams?.favourite)) return null;



    if(!data || data.length === 0){
        return (
            <div className="h-full w-full flex flex-col items-center justify-center">
                <ImageWithDownTitle src={"/emptyFavourites.png"} title={"No Favourite Board Found"}/>
            </div>
        )
    }

    return (
        <div>
            Favourite Board
        </div>
    );
}

export default FavouriteBoard;