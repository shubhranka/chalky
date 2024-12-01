
import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  // Get the current user from your database

  try{
  const authorization = auth();
  const user = await currentUser();

  if (!user || !authorization) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { room } = await request.json();

  if (!room) {
    return new Response("Missing room", { status: 400 });
  }

  const board = await convex.query(api.board.getBoard, {
    id: room,
  })

    if (!board) {
        return new Response("Room not found", { status: 404 });
    }

    if (board.orgId !== authorization.orgId) {
        return new Response("Unauthorized", { status: 401 });
    }

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
  user.id,
  {
    userInfo: {
      name: user.username!,
      avatar: user.imageUrl,
    }
  }
);

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
  session.allow(room, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
catch (error) {
  return new Response("Unauthorized", { status: 401 });
};
}