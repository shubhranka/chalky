"use client"

import { cn } from "@/lib/utils";
import { useOrganization, useOrganizationList } from "@clerk/clerk-react";
import Image from "next/image";
import Hint from "./Hint";

interface ItemProps {
    id: string;
    name: string;
    imgUrl?: string;
}

const Item = ({ id, name, imgUrl }: ItemProps) => {

    const { organization } = useOrganization();
    const { setActive } = useOrganizationList();

    const isActive = organization?.id === id;

    return (
        <div className="aspect-square relative">
            <Hint content={name} side="right" sideOffset={20}>
                <Image
                    fill
                    alt={name}
                    src={imgUrl!}
                    onClick={() => setActive ? setActive({ organization: id }) : null}
                    className={cn(
                        "rounded-md cursor-pointer opacity-55 hover:opacity-100 transition",
                        isActive && "opacity-100"
                    )}
                />
            </Hint>
        </div>
    )
}

export default Item