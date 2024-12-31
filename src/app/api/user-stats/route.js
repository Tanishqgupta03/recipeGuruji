import { dbConnect } from "@/lib/dbConnect";
import Follower from "@/model/Follower";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/option";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const followerId = session.user.id;

    await dbConnect();

    const followersCount = await Follower.countDocuments({ followingId: userId });
    const followingCount = await Follower.countDocuments({ followerId: userId });

    // Check if the user is followed by the logged-in user
    const isFollowed = await Follower.exists({
      followerId: followerId,
      followingId: userId
    });

    return new Response(
      JSON.stringify({ followersCount, followingCount, isFollowed }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}