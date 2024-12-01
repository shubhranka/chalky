import Hint from "@/app/(dashboard)/_components/Hint";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getUserColor } from "@/lib/utils";

interface UserAvatarProps {
    name: string;
    avatar: string;
    connectionId: number;
}

export default function UserAvatar(
    {name, avatar, connectionId}: UserAvatarProps
){
    const userColor = getUserColor(connectionId);
    return (
        <Hint content="User">
            <Avatar className={`
                    border-2
                    border-[${userColor}]
                `}>
                <AvatarImage src={avatar} alt={name} width={20} height={20} />
                <p className="text-xs">{name}</p>
            </Avatar>
        </Hint>
    )
};