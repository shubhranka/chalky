import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/api-mutation";
import { api } from "@/convex/_generated/api";
import ConfirmModal from "./comfirm-modal";
import { Button } from "./ui/button";



interface ActionsProps {
  children: React.ReactNode;
  id: string;
  title: string;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
}

export default function Actions({ children, id, title, side, sideOffset }: ActionsProps) {

    const onCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast("Link copied to clipboard");
    };

    const {mutate, pending } = useApiMutation(api.board.remove);

    const onDelete = async () => {
        try {
            await mutate({
                id: id,
            });
            toast.success("Board Deleted Successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete board");
        }
    };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem onClick={onCopyLink}>
          <Link2 size={16} className="ml-2"/>
          Copy link
        </DropdownMenuItem>
        <ConfirmModal
            disabled={pending}
            onConfirm={onDelete}
            header={`Delete ${title}`}
            description="Are you sure you want to delete this board?"
            >

        
          <Button 
            variant={"ghost"}
            size={"sm"}
            className="w-full justify-start text-sm font-normal"
          >
          <Trash2 size={16} className="ml-1"/>
            Delete
        </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
