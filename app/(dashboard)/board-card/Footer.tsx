import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface FooterProps {
    title: string;
    authorLabel: string;
    createdAt: string;
    isFavourite: boolean;
    onClick: () => void;
    disabled: boolean;
}
export default function Footer(
    { title, authorLabel, createdAt, isFavourite, onClick, disabled }: FooterProps
) {
    return (
        <div className="relative bg-white p-3">
            <p className="text-[13px] truncate max-w-calc(100%-20px)">{title}</p>
            <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-125 text-[11px] text-muted-foreground truncate">
                {authorLabel} - {createdAt}
            </p>
            <button
                disabled={disabled}
                onClick={onClick}
                className={cn(
                    "opacity-0 group-hover:opacity-100 transition duration-125 absolute top-3 right-3 text-muted-foreground hover:text-pink-500",
                    disabled && "cursor-not-allowed opacity-75"
                )}
            >
                <Star
                    className={cn(
                        "h-4 w-4",
                        isFavourite ? "fill-pink-600 text-pink-600" : "text-muted-foreground"
                    )}
                ></Star>

            </button>
        </div>
    )
}