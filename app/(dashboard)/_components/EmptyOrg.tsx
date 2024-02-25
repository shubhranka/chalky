import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/clerk-react";
import Image from "next/image";
import ImageWithDownTitle from "./ImageWithDownTitle";

const EmptyOrg = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            
            {/* <Image alt="Empty Org" src="/front-3.png" width={300} height={300} />

            <h2 className="text-2xl font-semibold">
                Welcome to Chalky
            </h2> */}

            <ImageWithDownTitle src="/front-3.png" title="Welcome to Chalky" />

            <p className="text-muted-foreground text-sm text-center mt-2">
                Get started by creating your first organization
            </p>

            <div className="mt-3">
                <Dialog>
                    <DialogTrigger>
                        <Button size={"lg"}
                        >
                            Create Organization
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-transparent border-none max-w-[500px]">
                        <CreateOrganization />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default EmptyOrg;