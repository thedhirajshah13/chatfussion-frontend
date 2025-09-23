import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { errors } from "../utils/tostify";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import { useConversationContext } from "../context/conversationContext";
import { useAuthContext } from "../context/AuthContext";
import profileImg from "../assets/profile.png";
import { useSocketContext } from "../context/socketContext";
import useListenMessage from "../socketHooks";

const Chats = ({ chatUserDetails }) => {
  const [isSending, setIsSending] = useState(false);
  const { chatUserId, profile, name } = chatUserDetails;
  const { auth } = useAuthContext();
  const { onlineUser } = useSocketContext();
  useListenMessage();

  const [message, setMessage] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const { currentConversation, setConversation } = useConversationContext();

  // Fetch conversation
  useEffect(() => {
    if (!chatUserId) return;

    let isMounted = true;

    async function getConversation() {
      try {
        const url = `http://localhost:8000/${chatUserId}`;
        const response = await axios.get(url, {
          method: "GET",
          withCredentials: true,
        });

        if (
          JSON.stringify(response.data.conversation) !==
            JSON.stringify(currentConversation) ||
          isMounted
        ) {
          setConversation(response.data.conversation || []);
        }
      } catch (error) {
        console.log(error);
        throw new Error(error);
      } finally {
      }
    }

    getConversation();
    return () => {
      isMounted = false;
    };
  }, [chatUserId, /*setConversation*/]);

  const handleInput = (e) => setMessage(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message && !media) {
      errors("Type a message or select media");
      return;
    }

    setIsSending(true);
    const formData = new FormData();
    formData.append("message", message);
    if (media) formData.append("media", media);

    try {
      const url = `http://localhost:8000/sendmessage/${chatUserId}`;
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setConversation((prev) => [...prev, response.data.message]);
      setMessage("");
      setMedia(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      errors("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Helper: group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const dateStr = new Date(msg.createdAt).toLocaleDateString();
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(msg);
    });
    return groups;
  };

  // Helper: get date label like WhatsApp
  const getDateLabel = (dateStr) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const dateObj = new Date(dateStr);
    if (dateObj.toDateString() === today.toDateString()) return "Today";
    if (dateObj.toDateString() === yesterday.toDateString()) return "Yesterday";
    return dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="flex flex-col border border-gray-300 w-[100%] h-[100%]">
        {/* Header */}
  <div className="flex items-center m-2 p-2 h-[14%] border-b-2 gap-4 font-sans">
          <div className="relative">
            <img
              src={profile || profileImg}
              alt="profile img"
              className="w-14 h-14 rounded-full shadow-lg border-2 border-cyan-400 object-cover bg-white"
              style={{display:'block'}}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://ui-avatars.com/api/?name=User&background=random";
              }}
            />
            <span
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                onlineUser.includes(chatUserId) ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-white font-extrabold text-lg tracking-wide font-sans" style={{fontFamily:'Segoe UI,Roboto,Arial,sans-serif'}}>{name}</h1>
            <h6
              className={`text-xs font-medium italic mt-1 ${
                onlineUser.includes(chatUserId) ? "text-green-400" : "text-red-400"
              }`}
              style={{fontFamily:'Segoe UI,Roboto,Arial,sans-serif'}}
            >
              {onlineUser.includes(chatUserId) ? "Online" : "Offline"}
            </h6>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {currentConversation && currentConversation.length > 0 ? (
            Object.entries(groupMessagesByDate(currentConversation)).map(
              ([date, messages]) => (
                <React.Fragment key={date}>
                  <div className="flex justify-center my-2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg border border-white/30 opacity-90">
                      {getDateLabel(date)}
                    </span>
                  </div>
                  {messages.map((con) => (
                    <div key={con._id || Math.random()} className="flex flex-col">
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                          con.senderId === auth.id
                            ? "self-end bg-cyan-500 text-white"
                            : "self-start bg-slate-700 text-gray-200"
                        }`}
                      >
                        {con.message && <p className="font-sans text-base text-white" style={{fontFamily:'Segoe UI,Roboto,Arial,sans-serif',fontWeight:500}}>{con.message}</p>}
                          {con.mediaType === "image" && (
                            <div style={{width:'120px',height:'120px',margin:'6px 0',display:'block'}}>
                              <img
                                src={con.media}
                                alt="media"
                                className="rounded-lg shadow-md object-cover"
                                style={{width:'100%',height:'100%',border:'none',background:'transparent',display:'block'}} 
                              />
                            </div>
                        )}
                        {con.mediaType === "video" && (
                          <div style={{width:'120px',height:'120px',margin:'6px 0',display:'block'}}>
                            <video controls className="rounded-lg shadow-md object-cover" style={{width:'100%',height:'100%',border:'none',background:'transparent',display:'block'}}>
                              <source src={con.media} type="video/mp4" />
                            </video>
                          </div>
                        )}
                      </div>
                      <div
                        className={`text-xs mt-1 font-mono tracking-tight ${
                          con.senderId === auth.id
                            ? "text-right text-gray-400"
                            : "text-left text-gray-500"
                        }`}
                        style={{fontFamily:'monospace'}}
                      >
                        {new Date(con.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              )
            )
          ) : (
            <p className="text-center text-gray-400">No Messages Yet</p>
          )}
        </div>

        {/* Input */}
  <div className="border-t border-gray-700 p-4 bg-black/30 backdrop-blur-md relative">
          {isSending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
              <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          )}
          {preview && (
            <div className="my-2 flex items-center gap-2">
              {media.type.startsWith("image") ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <video src={preview} controls className="w-32 h-20 rounded" />
              )}
              <button
                type="button"
                onClick={() => {
                  setMedia(null);
                  setPreview(null);
                }}
                className="text-red-500 font-bold"
              >
                ✖
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <label htmlFor="mediaInput" className="cursor-pointer text-gray-300">
              <PaperClipIcon className="w-5 h-5" />
            </label>
            <input
              type="file"
              id="mediaInput"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              type="text"
              name="message"
              onChange={handleInput}
              value={message}
              className="flex-1 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400
                         bg-slate-800/60 text-white placeholder-gray-400"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="ml-3 p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Chats;
