import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { io, type Socket } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Room() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lobby, setLobby] = useState(false);
  const name = searchParams.get("name");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(URL);
    socket.on("lobby", () => {
      setLobby(true);
    });
    socket?.on("send-offer", ({ roomId }) => {
      console.log("Send offer for room " + roomId);
      setLobby(false);
      socket.emit("offer", { roomId, sdp: "fake-sdp" });
    });
    socket?.on("offer", ({ roomId, sdp }) => {
      console.log("Send answer with SDP: " + sdp);
      setLobby(false);
      socket.emit("answer", { roomId, sdp: "fake-answer-sdp" });
    });
    socket?.on("answer", ({ roomId, sdp }) => {
      setLobby(false);
      console.log("Received answer with SDP: " + sdp);
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [name]);

  return (
    <>
      <div>Hi, {name}</div>
      {lobby && <div>You are in the lobby, waiting for a match...</div>}
      {!lobby && <video width={400} height={400} />}
      {!lobby && <video width={400} height={400} />}
    </>
  );
}
