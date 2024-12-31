import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FaUserCircle } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const UserDetailsDialog = ({ user, isOpen, onClose }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [stats, setStats] = useState({ followersCount: 0, followingCount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserStats();
    }
  }, [isOpen]);

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user-stats?userId=${user._id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user stats");
      }

      setStats({
        followersCount: data.followersCount,
        followingCount: data.followingCount,
      });
      setIsFollowed(data.isFollowed); // Set follow status from fetched data
    } catch (error) {
      console.error("Error fetching user stats:", error.message);
      alert(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const method = isFollowed ? "DELETE" : "POST";

      console.log("method ; ",method);
      const response = await fetch("/api/follow-user", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId: user._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update follow status");
      }

      setIsFollowed(!isFollowed); // Toggle the follow state
      fetchUserStats(); // Update stats after follow/unfollow
    } catch (error) {
      console.error("Error following/unfollowing user:", error.message);
      alert(error.message || "Something went wrong!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <button
            className="text-black-500 hover:text-blue-700 mr-2"
            onClick={() => window.open(`/profiles/${user.username}`, "_blank")}
          >
            <FiArrowRight className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-center flex-grow">{user.username}</h2>
        </div>

        <div className="flex flex-col items-center">
          {user.userImage ? (
            <img
              src={user.userImage}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <FaUserCircle className="w-10 h-10 text-gray-400" />
            </div>
          )}
          <p className="text-gray-500 text-sm">@{user.username}</p>
        </div>

        {loading ? (
          <div className="flex justify-center mt-4">
            <div className="stats-loader"></div>
          </div>
        ) : (
          <div className="mt-2">
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <p className="text-lg font-semibold">{stats.followersCount}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">{stats.followingCount}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleFollowToggle}
          className={`mt-6 w-full py-2 rounded-md font-semibold text-white transition duration-200 ${
            isFollowed ? "bg-black hover:bg-gray-800" : "bg-black hover:bg-gray-800"
          }`}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;