import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

export const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { auth } = useAuthContext();

  useEffect(() => {
    if (auth) {
      const newSocket = io("https://chatfussion-backend.onrender.com", {
        auth: { userId: auth.id },
        withCredentials: true,
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("getOnlineUser", (users) => {
        console.log("Received online users:", users);
        setOnlineUser(users);
      });

      return () => {
        console.log("Disconnecting socket:", newSocket.id);
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        console.log("No auth, disconnecting existing socket:", socket.id);
        socket.disconnect();
        setSocket(null);
        setOnlineUser([]);
      }
    }
  }, [auth]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
