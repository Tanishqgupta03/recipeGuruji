// UserDetailsDialog.js
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FaUserCircle } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const UserDetailsDialog = ({ user, isOpen, onClose }) => {
  const [isFollowed, setIsFollowed] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowed((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <button
            className="text-blue-500 hover:text-blue-700 mr-2"
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

        <div className="mt-2">
          <div className="flex justify-center space-x-4"> {/* Adjusted space-x-16 to space-x-8 for better gaps */}
            <div className="text-center">
              <p className="text-lg font-semibold">0</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">0</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">0</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleFollowToggle}
          className={`mt-6 w-full py-2 rounded-md font-semibold text-white transition duration-200 ${
            isFollowed ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;