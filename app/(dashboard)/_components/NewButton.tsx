"use strict";

import { 
    Dialog,
    DialogContent,
    DialogTrigger
 } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/clerk-react";
import { Plus } from "lucide-react";

export default function NewButton() {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <div className="aspect-square">
                <button className="bg-white/25 h-full w-full flex justify-center items-center rounded-md opacity-60 hover:opacity-100 transition">
                    <Plus size={24} />
                </button>
            </div>
        </DialogTrigger>
        <DialogContent className="p-0 border-none max-w-[480px] bg-transparent"> 
            <CreateOrganization />
        </DialogContent>
    </Dialog>
  );
}