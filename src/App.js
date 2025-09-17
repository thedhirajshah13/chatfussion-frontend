import React from "react";
import { useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import { ConversationContextProvider } from "./context/conversationContext";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/socketContext";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  // Check if the route is login or signup
  const isAuthPage =
    location.pathname.includes("login") || location.pathname.includes("signup");

  console.log("Path:", location.pathname, "isAuthPage:", isAuthPage);

  return (
    <div className="relative min-h-screen w-full text-white font-sans">
      {/* Conditional Background */}
      {isAuthPage ? (
        // 🔹 Video for login/signup
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
        >
          <source src="/Login_signup_video.mp4" type="video/mp4" />
        </video>
      ) : (
        // 🔹 Pattern background for chat
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundColor: "#0e2232", // dark base color from your video
            backgroundImage: `url("http://localhost:3000/chat-pattern.png")`,
            backgroundRepeat: "repeat",
            backgroundSize: "300px",
          }}
        ></div>
      )}

      {/* Overlay for slight dim effect */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* App content */}
      <AuthContextProvider>
        <SocketContextProvider>
          <ConversationContextProvider>
            <main className="relative z-20 min-h-screen">
              <Home />
              <ToastContainer position="top-right" autoClose={3000} />
            </main>
          </ConversationContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
