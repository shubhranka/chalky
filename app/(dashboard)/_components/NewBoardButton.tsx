import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/api-mutation";
import { cn } from "@/lib/utils";
import { useOrganization } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import { title } from "process";
import { toast } from "sonner";

interface NewBoardButtonProps {
  createBoard: () => void;
  pending: boolean;
}

const NewBoardButton = ({ createBoard, pending }: NewBoardButtonProps) => {
  return (
    <button
      disabled={pending}
      onClick={createBoard}
      className={cn(
        "rounded-lg bg-black flex flex-col items-center justify-center cursor-pointer hover:bg-black/75 transition duration-125",
        pending && "cursor-not-allowed bg-black/75"
      )}
    >
      <Plus className="text-white h-12 w-12 stroke-1" />
      <p
        className="
                text-white text-lg font-semibold
            "
      >
        {!pending ? "New Board" : "Creating Board"}
      </p>
    </button>
  );
};

export default NewBoardButton;
