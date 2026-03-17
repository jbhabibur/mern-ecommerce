import { io } from "socket.io-client";

// Get URL from environment variables, fallback to localhost if not defined
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  // Using both websocket and polling ensures stable connection across different hosting environments
  transports: ["websocket", "polling"],
});
