import ImageWithDownTitle from "./ImageWithDownTitle";

interface SearchBoardsProps {
    searchParams?: {
        search?: string;
    },
    data: any;
}

const SearchBoards = ({searchParams,data} : SearchBoardsProps) => {
    console.log(searchParams)
    if(!(searchParams?.search)) return null;

    const favourite = false

    if(!favourite){
        return (
            <div className="h-full w-full flex flex-col items-center justify-center">
                <ImageWithDownTitle src={"/notFound.png"} title={"No Boards Found"}/>
            </div>
        )
    }

    return (
        <div>
            Favourite Board
        </div>
    );
}

export default SearchBoards;