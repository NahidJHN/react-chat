/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import useAuthUser from "../hooks/AuthUser";
import { localUrl, productionUrl } from "../utils/baseURL";

export const SocketContext = createContext<any>(null);

function SocketContextProvider({ children }: React.PropsWithChildren) {
  const user = useAuthUser();
  const [socket, setSocket] = useState<Socket>();
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!socket?.connected) {
      if (!user) return;
      const socket = io(
        process.env.NODE_ENV === "production" ? productionUrl : localUrl,
        {
          query: {
            userId: user._id,
          },
        }
      );
      //then listen the event
      socket.on("onConnection", (data: any) => {
        setOnlineUsers(data);
      });

      //then listen the event
      socket.on("onDisConnection", (data: any) => {
        setOnlineUsers(data);
      });
      setSocket(socket);
    }

    return () => {
      socket?.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
export default SocketContextProvider;
