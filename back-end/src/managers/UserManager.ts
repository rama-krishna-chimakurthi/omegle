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
        this.initHandlers(socket);
        this.clearQueue();
    }

    removeUser(socket: string) {
        this.users = this.users.filter(user => user.socket.id !== socket);
    }

    getUser(socket: string): User | undefined {
        return this.users.find(user => user.socket.id === socket);
    }

    clearQueue() {
        if (this.queue.length < 2) {
            return;
        }
        const user1 = this.users.find(user => user.socket.id === this.queue.pop());
        const user2 = this.users.find(user => user.socket.id === this.queue.pop());
        if (!user1 || !user2) {
            console.log("Failed to match users");
            return;
        }
        console.log(`Matched ${user1.name} with ${user2.name}`);
        this.roomManager.createRoom(user1, user2);
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