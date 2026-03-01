import type { Socket } from "socket.io";
import type { RoomManager } from "./RoomManager.js";

export interface User {
    name: string;
    socket: Socket;
}

export class UserManager {
    private users: User[];
    private queue: string[];
    private roomManager: RoomManager;

    constructor(roomManager: RoomManager) {
        this.roomManager = roomManager;
        this.users = [];
        this.queue = [];
    }

    addUser(name: string, socket: Socket) {
        this.users.push({ name, socket });
        this.queue.push(socket.id);
        socket.emit("lobby");
        console.log(this.users);
        this.initHandlers(socket);
        this.clearQueue();
    }

    removeUser(socket: string) {
        const user = this.users.find(user => user.socket.id === socket);
        if (user) {
            console.log(`Removing user ${user.name} with socket ${socket}`);
        }
        this.users = this.users.filter(user => user.socket.id !== socket);
    }

    getUser(socket: string): User | undefined {
        return this.users.find(user => user.socket.id === socket);
    }

    clearQueue() {
        if (this.queue.length < 2) {
            return;
        }
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        console.log("id is " + id1 + " " + id2);
        const user1 = this.users.find(x => x.socket.id === id1);
        const user2 = this.users.find(x => x.socket.id === id2);

        if (!user1 || !user2) {
            return;
        }
        console.log("creating room for " + user1.name + " and " + user2.name);

        const room = this.roomManager.createRoom(user1, user2);
        this.clearQueue();
    }

    initHandlers(socket: Socket) {
        socket.on("offer", ({ roomId, sdp }: { roomId: string, sdp: string }) => {
            this.roomManager.onOffer(roomId, sdp);
        });
        socket.on("answer", ({ roomId, sdp }: { roomId: string, sdp: string }) => {
            this.roomManager.onAnswer(roomId, sdp);
        });
    }

}