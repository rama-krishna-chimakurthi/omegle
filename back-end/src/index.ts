import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    // You can define other event handlers here
    socket.on("hello", (data) => {
        console.log(data); // "world"
    });
});

httpServer.listen(3000, () => console.log(`API running on localhost:3000`));
