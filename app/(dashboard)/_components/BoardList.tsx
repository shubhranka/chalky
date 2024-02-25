import { Button } from "@/components/ui/button";
import FavouriteBoard from "./FavouriteBoard";
import ImageWithDownTitle from "./ImageWithDownTitle";
import SearchBoards from "./SearchBoards";

interface BoardListProps {
    searchParams: {
        search: string;
        favourite: boolean;
    }
}

const data : any = []

const BoardList = ({searchParams} : BoardListProps) => {

    
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
                            <Button size={"lg"}>
                                Create Board
                            </Button>
                        </div>
                    </div>
            }
            </div>
    );
}

export default BoardList;