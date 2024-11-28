"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ children, roomId }: { children: ReactNode, roomId: string }) {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_8TF2aln2cyGV617kkEM6Pemg-FJGQ7NThuHMBuIFqforDh085oI_kQEJs5aGxh_e"}>
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}