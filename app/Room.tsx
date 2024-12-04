"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveList, LiveMap } from "@liveblocks/client";

export function Room({ children, roomId, fallback }: { children: ReactNode, roomId: string, fallback?: ReactNode }) {
  return (
    <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"} throttle={16} >
      <RoomProvider id={roomId} initialPresence={
        {
          cursor: {
            x: -1,
            y: -1
          },
          selection: [],
          drawingPoints: [],
          drawing: false
        }
      }
      initialStorage={{
        layers: new LiveMap(),
        layerIds: new LiveList([])
      }}
      >
        <ClientSideSuspense fallback={fallback}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}