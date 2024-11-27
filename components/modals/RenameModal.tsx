import { useRenameModal } from "@/store/use-rename-modal";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/api-mutation";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";

export default function RenameModal() {
    const {
        isOpen,
        onClose,
        id,
        title,
    } = useRenameModal();

    const [thisTitle, setThisTitle] = useState(title);
    const [thisId, setThisId] = useState(id);

    useEffect(() => {
        setThisTitle(title);
        setThisId(id);
    },[title,id]);

    const {mutate: renameMutate, pending} = useApiMutation(api.board.update);
    const onSubmit = () => {
        try{
            renameMutate({
                id: thisId,
                title: thisTitle
            });
            onClose();
            toast.success("Board Renamed Successfully");
        }catch(error){
            console.error(error);
            toast.error("Failed to rename board");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Rename {title}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter a new name for {title}
                </DialogDescription>
                    <Input
                        value={thisTitle}
                        onChange={(e) => setThisTitle(e.target.value)}
                        placeholder="New Title"
                    />
                <DialogFooter>
                    <DialogClose>
                        <Button onClick={onClose} type="button" variant={"outline"}>
                            Cancel
                        </Button> 
                    </DialogClose>
                    <Button type="submit" disabled={pending} onClick={onSubmit} >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}