import ImageWithDownTitle from "./ImageWithDownTitle";

interface FavouriteBoardProps {
    searchParams?: {
        favourite?: boolean;
    },
    data: any;
}

const FavouriteBoard = ({searchParams,data} : FavouriteBoardProps) => {
    if(!(searchParams?.favourite)) return null;

    const favourite = false

    if(!favourite){
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