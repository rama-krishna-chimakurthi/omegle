import { createServer } from "http";
import { Server } from "socket.io";
import { UserManager } from "./managers/UserManager.js";
import { RoomManager } from "./managers/RoomManager.js";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

const roomManager = new RoomManager();
const userManager = new UserManager(roomManager);

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    // You can define other event handlers here
    userManager.addUser("randomname", socket);
    io.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        userManager.removeUser(socket.id);
    });
});

httpServer.listen(3000, () => console.log(`API running on localhost:3000`));
