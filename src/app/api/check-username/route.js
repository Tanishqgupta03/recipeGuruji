import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the query string from the request URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.trim() === "") {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Search for users with usernames starting with the query and who are verified
    const users = await UserModel.find({
      username: { $regex: `^${query}`, $options: "i" }, // Case-insensitive starts-with search
      isVerified: true,
    })
      .select("username email") // Select only required fields
      .limit(10); // Limit the number of results

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error searching for users:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
