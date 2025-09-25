import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/socketContext";
import Chats from "./Chats";
import profileImg from "../assets/profile.png";

import {
  ChatBubbleLeftEllipsisIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  PencilSquareIcon,
  
} from "@heroicons/react/24/outline";
import { success, errors } from "../utils/tostify";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [chatUser, setChatUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false);
  const [userProfileDetails, setUserProfileDetails] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const { setAuth, auth } = useAuthContext();
  const { onlineUser } = useSocketContext();
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({});

  // Handle edit icon click
  const handleEditField = (field) => {
    setEditMode(true);
    setEditProfile({ ...userProfileDetails });
    setTimeout(() => {
      const el = document.getElementById(`edit-${field}`);
      if (el) el.focus();
    }, 100);
  };

  // Handle save
  const handleSaveProfile = async () => {
    try {
      await axios.put(`http://localhost:8000/auth/updateUserDetails/${userProfileDetails._id}`, editProfile, { withCredentials: true });
      setUserProfileDetails({ ...editProfile });
      setEditMode(false);
      success("Profile updated!");
    } catch (err) {
      errors("Failed to update profile");
    }
  };

  const [chatUserDetails, setChatUserDetails] = useState({
    chatUserId: "",
    profile: "",
    name: "",
  });

  const handleChatSlide = (chatUserId, profile, name) => {
    setChatUser(true);
    setChatUserDetails({ chatUserId, profile, name });
    setSearchResult(null);
  };

  const searchUser = async () => {
    if (!searchQuery.trim()) return;
    try {
      const url = `http://localhost:8000/search/user?username=${searchQuery}`;
      const { data } = await axios.get(url, { withCredentials: true });
      setSearchResult(data);
    } catch {
      setSearchResult(null);
      errors("User not found");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUserLoading(true);
        const { data } = await axios.get("http://localhost:8000/user/all", {
          withCredentials: true,
        });
        setUsers(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUsers();
  }, [chatUser]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:8000/auth/logout",
        {},
        { withCredentials: true }
      );
      success(data.msg);
      localStorage.setItem("chat-user", "");
      setAuth("");
    } catch {
      errors("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUserProfile = async (id) => {
    try {
      const userProfile = await axios.get(
        `http://localhost:8000/auth/getUserDetails/${id}`,
        { withCredentials: true }
      );
      setUserProfileDetails(userProfile.data.user);
      setIsProfileDetailsOpen(true);
      console.log(userProfile.data.user);
    } catch (error) {
      errors("Failed to load profile");
    }
  };

  return (
    <div
      className="flex h-screen p-6 gap-4"
      style={{
        backgroundColor: "#0e2232",
        backgroundImage: `url("/chat-pattern.png")`,
        backgroundRepeat: "repeat",
        backgroundSize: "300px",
      }}
    >
      {/* Left Sidebar */}
      <div className="w-[30%] flex flex-col justify-between h-[90vh] ml-[2%] rounded-xl border-2 border-gray-800 bg-black/30 backdrop-blur-md shadow-lg p-4 font-sans">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-2xl font-extrabold text-white tracking-wide"
            style={{ fontFamily: "Segoe UI,Roboto,Arial,sans-serif" }}
          >
            Chats
          </h2>
          <div className="flex gap-3 text-white">
            <ChatBubbleLeftEllipsisIcon className="w-6 h-6 cursor-pointer hover:text-cyan-400" />
            <FunnelIcon className="w-6 h-6 cursor-pointer hover:text-cyan-400" />
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add New User or Search Existing One with their username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 rounded-full bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={searchUser}
              className="p-2 bg-cyan-500 rounded-full hover:bg-cyan-600 transition"
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="absolute top-[90px] left-6 w-[280px] rounded-2xl border-2 border-cyan-600 bg-gradient-to-br from-black via-gray-900 to-cyan-900 shadow-2xl p-4 z-50 animate-fade-in font-sans">
            <div
              className="flex items-center gap-4 cursor-pointer hover:bg-cyan-700/20 p-3 rounded-xl transition duration-200"
              onClick={() =>
                handleChatSlide(
                  searchResult._id,
                  searchResult.profileImg,
                  searchResult.name
                )
              }
            >
              <img
                src={searchResult.profileImg || profileImg}
                alt="user"
                className="w-14 h-14 rounded-full border-2 border-cyan-500 shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://ui-avatars.com/api/?name=User&background=random";
                }}
              />
              <div>
                <p
                  className="font-bold text-cyan-300 text-lg"
                  style={{
                    fontFamily: "Segoe UI,Roboto,Arial,sans-serif",
                    textTransform: "capitalize",
                  }}
                >
                  {searchResult.name &&
                    searchResult.name.charAt(0).toUpperCase() +
                      searchResult.name.slice(1)}
                </p>
                <p className="text-sm text-gray-400 font-mono">
                  @{searchResult.username}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSearchResult(null)}
              className="mt-3 px-4 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition duration-150 float-right"
            >
              Close
            </button>
          </div>
        )}

        {/* User List */}
        <div className="flex-1 overflow-y-auto mt-2 font-sans">
          {userLoading ? (
            <p className="text-white text-center">Loading users...</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() =>
                  handleChatSlide(user._id, user.profileImg, user.name)
                }
                className={`flex items-center gap-3 p-2 mb-1 rounded-lg cursor-pointer hover:bg-white/10 ${
                  chatUserDetails.chatUserId === user._id
                    ? "bg-cyan-600/40"
                    : ""
                }`}
                style={{ fontFamily: "Segoe UI,Roboto,Arial,sans-serif" }}
              >
                <div className="relative">
                  <img
                    src={user.profileImg || profileImg}
                    alt="user"
                    className="w-12 h-12 rounded-full border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://ui-avatars.com/api/?name=User&background=random";
                    }}
                  />
                  {onlineUser.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <p
                  className="text-white font-semibold text-base"
                  style={{ textTransform: "capitalize", fontWeight: 600 }}
                >
                  {user.name &&
                    user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Logout */}
        <div className="flex items-center justify-between mt-4 p-2 bg-black/20 rounded-lg">
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <p className="text-white font-bold">{auth.name}</p>
            <img
              onClick={() => handleUserProfile(auth._id || auth.id)}
              src={auth.profileImg || profileImg}
              alt="profile"
              className="w-10 h-10 rounded-full border cursor-pointer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://ui-avatars.com/api/?name=User&background=random";
              }}
            />
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {isProfileDetailsOpen && userProfileDetails && (
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-black/30 border-2 border-gray-800 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-[92vw] max-w-xs h-[520px] min-h-[400px] relative flex flex-col items-center animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setIsProfileDetailsOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
              <div className="relative mb-4 flex flex-col items-center gap-2">
                <img
                  src={editMode ? editProfile.profileImg : userProfileDetails.profileImg || profileImg}
                  alt="profile"
                  className="w-20 h-20 rounded-full border-2 border-cyan-400 shadow-md object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://ui-avatars.com/api/?name=User&background=random";
                  }}
                />
                <label className={`mt-1 ${editMode ? 'cursor-pointer text-cyan-600 hover:text-cyan-800' : 'cursor-not-allowed text-gray-400'} text-xs font-semibold flex items-center gap-1`}>
                  <PencilSquareIcon className="w-4 h-4" />
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={!editMode}
                    onChange={async (e) => {
                      if (!editMode) return;
                      const file = e.target.files[0];
                      if (file) {
                        // Optionally show preview
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditProfile({ ...editProfile, profileImg: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {!editMode && (
                  <button className="absolute bottom-2 right-2 bg-cyan-500 hover:bg-cyan-600 rounded-full p-1 w-7 h-7 flex items-center justify-center" onClick={() => handleEditField('profileImg')}>
                    <PencilSquareIcon className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-2 w-full justify-center mb-1">
                  <input
                    id="edit-name"
                    type="text"
                    value={editMode ? editProfile.name : userProfileDetails.name}
                    onChange={e => editMode && setEditProfile({ ...editProfile, name: e.target.value })}
                    className="text-xl font-bold text-cyan-700 bg-white/90 border border-cyan-400 rounded px-3 py-1 text-center w-40 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
                    placeholder="Enter name"
                    readOnly={!editMode}
                    style={!editMode ? { backgroundColor: '#f3f4f6', color: '#64748b', cursor: 'not-allowed' } : {}}
                  />
                  <button className="bg-cyan-500 hover:bg-cyan-600 rounded-full p-1 w-7 h-7 flex items-center justify-center" onClick={() => handleEditField('name')}>
                    <PencilSquareIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-2 w-full justify-center mb-1">
                  <input
                    id="edit-username"
                    type="text"
                    value={editMode ? editProfile.username : userProfileDetails.username}
                    onChange={e => editMode && setEditProfile({ ...editProfile, username: e.target.value })}
                    className="text-gray-600 font-mono text-base bg-white/90 border border-cyan-400 rounded px-3 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
                    placeholder="Enter username"
                    readOnly={!editMode}
                    style={!editMode ? { backgroundColor: '#f3f4f6', color: '#64748b', cursor: 'not-allowed' } : {}}
                  />
                  <button className="bg-cyan-500 hover:bg-cyan-600 rounded-full p-1 w-7 h-7 flex items-center justify-center" onClick={() => handleEditField('username')}>
                    <PencilSquareIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-2 w-full justify-center mb-1">
                  <select
                    id="edit-gender"
                    value={editMode ? editProfile.gender : userProfileDetails.gender}
                    onChange={e => editMode && setEditProfile({ ...editProfile, gender: e.target.value })}
                    className="text-gray-500 text-sm capitalize bg-white/90 border border-cyan-400 rounded px-3 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    disabled={!editMode}
                    style={!editMode ? { backgroundColor: '#f3f4f6', color: '#64748b', cursor: 'not-allowed' } : {}}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <button className="bg-cyan-500 hover:bg-cyan-600 rounded-full p-1 w-7 h-7 flex items-center justify-center" onClick={() => handleEditField('gender')}>
                    <PencilSquareIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-2 w-full justify-center mt-2">
                  <span className="text-gray-500 text-sm">Joined: {new Date(userProfileDetails.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {editMode && (
                <button
                  className="mt-6 px-6 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow transition duration-150"
                  onClick={handleSaveProfile}
                >
                  Save
                </button>
              )}
          </div>
        </div>
      )}
      {/* Right Chat Column */}
      <div className="w-[68%] rounded-xl border-2 border-gray-800 bg-black/30 backdrop-blur-md shadow-lg h-[90vh] mr-[2%] flex flex-col">
        {chatUser ? (
          <Chats chatUserDetails={chatUserDetails} />
        ) : (
          <div className="flex justify-center items-center h-full text-white font-bold text-3xl">
            CHATFUSSION
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
