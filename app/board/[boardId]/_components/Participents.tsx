"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import UserAvatar from "./UserAvatar";

const MAX_OTHER_SHOWN_USERS = 3;

const Participents = () => {
  const currentUser = useSelf();
  const otherUsers = useOthers();
  return (
    <div className="absolute top-2 right-2 bg-white rounded-md px-1.5 py-1.5 h-12 flex flex-row items-center shadow-md justify-center gap-2">
      {currentUser && (
        <UserAvatar avatar={currentUser.info.avatar} name={currentUser.info.name} connectionId={currentUser.connectionId} />
      )}
      {otherUsers.slice(0, MAX_OTHER_SHOWN_USERS).map((user) => (
        <UserAvatar avatar={user.info.avatar} name={user.info.name} key={user.info.avatar} connectionId={user.connectionId} />
      ))}
      {otherUsers.length > MAX_OTHER_SHOWN_USERS && (
        <div className="bg-white-100 text-muted-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm">
          +{otherUsers.length - MAX_OTHER_SHOWN_USERS}
        </div>
      )}
    </div>
  );
};
export default Participents;

export function ParticipentsSkeleton() {
  return (
    <div className="absolute top-2 right-2 bg-white rounded-md px-1.5 py-1.5 h-12 flex items-center shadow-md w-64">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
