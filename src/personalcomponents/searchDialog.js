// SearchDialog.js
import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import UserDetailsDialog from "./userDetail"; // Import the UserDetailsDialog component

// Custom hook to debounce a value
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SearchDialog = ({ isOpen, onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    if (debouncedSearchText.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/check-username?query=${debouncedSearchText}`);
        const data = await response.json();

        console.log("data after search : ",data);

        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedSearchText]);

  const handleRemoveResult = (id) => {
    setResults(results.filter((result) => result._id !== id));
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="p-6">
          <DialogHeader className="flex items-center space-x-3">
            <img src="/images/logo.webp" alt="RecipeGuruji Logo" className="w-10 h-10 rounded-full" />
            <h2 className="text-lg font-semibold">Find your Recipe Guru</h2>
          </DialogHeader>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="mt-4 space-y-2">
            {results.length > 0 ? (
              <ul className="space-y-2">
                {results.map((result) => (
                  <li
                    key={result._id}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleUserClick(result)} // Handle click on user
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {result.userImage ? (
                          <img
                            src={result.userImage}
                            alt="User Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="w-full h-full text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {result.username}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from bubbling up to the parent
                        handleRemoveResult(result._id);
                      }}
                      className="text-gray-500 hover:text-red-500 focus:outline-none"
                    >
                      <MdClose className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No results found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          isOpen={isUserDetailsOpen}
          onClose={() => setIsUserDetailsOpen(false)}
        />
      )}
    </>
  );
};

export default SearchDialog;


/*To understand how the useEffect in the SearchDialog component reacts to changes in the debounced value (debouncedSearchText), let’s break it down step by step.

Key Players in the Debouncing Mechanism
State Variables:

searchText: Tracks the raw user input in the search field.
debouncedSearchText: A state variable that updates 300ms after the user stops typing.
Custom Hook useDebounce:

Handles the delay logic and ensures the debouncedSearchText updates after the specified delay.
useEffect in SearchDialog:

Reacts to changes in debouncedSearchText to trigger the API call.
Flow of Execution
1. Typing in the Input Field
When the user types in the search field, the onChange handler updates searchText:
jsx
Copy code
onChange={(e) => setSearchText(e.target.value)}
2. useDebounce Hook Reacts
The useDebounce hook listens to changes in searchText and schedules a delayed update to debouncedValue:

jsx
Copy code
useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedValue(value); // Updates the debounced value after the delay
  }, delay);

  return () => {
    clearTimeout(handler); // Clears the timeout if value changes within the delay period
  };
}, [value, delay]);
A setTimeout starts when searchText changes, scheduling the update of debouncedValue (aka debouncedSearchText).
If the user types again before 300ms, the timeout is cleared (via clearTimeout), and a new one starts. This prevents unnecessary updates.
3. debouncedSearchText Updates
Once the user stops typing and 300ms passes without interruption, the setDebouncedValue function updates debouncedSearchText.
4. useEffect in SearchDialog Reacts
The useEffect in SearchDialog listens for changes in debouncedSearchText:

jsx
Copy code
useEffect(() => {
  if (debouncedSearchText.trim() === "") {
    setResults([]); // Clears results for empty input
    return;
  }

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/check-username?query=${debouncedSearchText}`);
      const data = await response.json();
      setResults(data); // Updates search results
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    }
  };

  fetchResults();
}, [debouncedSearchText]); // Dependency array
When debouncedSearchText updates, this useEffect is triggered.
If debouncedSearchText is empty, results are cleared.
Otherwise, an API call is made using the debounced value.
Why Does It Work?
The custom useDebounce hook ensures that debouncedSearchText only updates after the user stops typing for 300ms. This prevents frequent and redundant API calls while typing. The useEffect in SearchDialog reacts only when the debounced value changes, ensuring efficient updates.

Execution Timing (Example)
User types "appl":

searchText updates immediately with each keystroke (a, ap, app, appl).
useDebounce delays updating debouncedSearchText for 300ms after each change.
User stops typing:

After 300ms, debouncedSearchText updates to "appl".
The useEffect in SearchDialog triggers an API call with "appl".
Results are fetched and displayed. */