import { dbConnect } from "@/lib/dbConnect";
import Follower from "@/model/Follower";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    console.log("session in follow : ",session)

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const followerId = session.user.id;

    console.log("followerId in follow : ",followerId)

    const { followingId } = await request.json();

    console.log("followingId in follow : ",followingId)

    if (followerId === followingId) {
      return new Response(
        JSON.stringify({ error: "You can't follow yourself" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existingFollow = await Follower.findOne({ followerId, followingId });
    if (existingFollow) {
      return new Response(
        JSON.stringify({ error: "Already following this user" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await Follower.create({ followerId, followingId });
    return new Response(
      JSON.stringify({ message: "Successfully followed" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error following user:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
