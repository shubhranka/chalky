import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OrganizationProfile } from "@clerk/clerk-react";
import { Plus } from "lucide-react";

const InviteButton = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant={"outline"}>
                    <Plus className="h-4 w-4 text-muted-foreground mr-2"/>
                    Invite Members
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
                <OrganizationProfile />
            </DialogContent>
        </Dialog>
    )
};

export default InviteButton