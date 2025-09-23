import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { auth } = useAuthContext();
  // console.log(auth.id)

  useEffect(() => {
    if (auth) {
      console.log("Auth found:", auth);  // Debugging log for auth

      const newSocket = io("http://localhost:8000", {
        query: {
          userId: auth.id,
        },
      });
      
      setSocket(newSocket);

      // Debugging log for when a new socket connection is established
      // console.log("Socket connected:", newSocket.id);

      // Listener for online users update
      newSocket.on("getOnlineUser", (users) => {
        console.log("Received online users:", users);  // Debugging log for online users
        setOnlineUser(users);
      });

      // Cleanup function for disconnecting the socket
      return () => {
        console.log("Disconnecting socket:", newSocket.id);  // Debugging log for disconnection
        newSocket.disconnect();
      };
    } else {
      // If no auth is found, cleanup any active socket
      if (socket) {
        console.log("No auth, disconnecting existing socket:", socket.id);  // Debugging log
        socket.disconnect();
        setSocket(null);
        setOnlineUser([]);  // Clear the online users when logged out
      }
    }
  }, [auth]);  // Dependency on auth, so it re-runs when auth changes

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
