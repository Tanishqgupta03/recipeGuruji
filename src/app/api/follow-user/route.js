import { dbConnect } from "@/lib/dbConnect";
import Follower from "@/model/Follower";
import { getSession } from 'next-auth/react'; // Ensure authenticated users

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { followingId } = req.body;

    try {
      await dbConnect();
      const session = await getSession({ req });

      if (!session) return res.status(401).json({ error: 'Unauthorized' });

      const followerId = session.user.id; // Current user ID

      // Prevent self-follow
      if (followerId === followingId) {
        return res.status(400).json({ error: "You can't follow yourself" });
      }

      // Create a follow relationship
      const existingFollow = await Follower.findOne({ followerId, followingId });
      if (existingFollow) {
        return res.status(400).json({ error: 'Already following this user' });
      }

      await Follower.create({ followerId, followingId });
      res.status(200).json({ message: 'Successfully followed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}