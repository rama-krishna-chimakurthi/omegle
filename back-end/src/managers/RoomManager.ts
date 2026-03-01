import type { User } from "./UserManager.js";

interface Room {
    user1: User;
    user2: User;
}

let roomIdCounter = 0;

export class RoomManager {

    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map();
    }

    createRoom(user1: User, user2: User) {
        const roomId = this.generateRoomId();
        const room: Room = { user1, user2 };
        this.rooms.set(roomId, room);

        console.log(`Created room ${roomId} for ${user1.name} and ${user2.name}`);

        user1.socket.emit("send-offer", { roomId });

    }

    generateRoomId(): string {
        return `room-${roomIdCounter++}`;
    }

    // SDP => Session Description Protocol, used in WebRTC for negotiating connections

    onOffer(roomId: string, sdp: string) {
        const user2 = this.rooms.get(roomId)?.user2;
        user2?.socket.emit("offer", { roomId, sdp });
    }

    onAnswer(roomId: string, sdp: string) {
        const user1 = this.rooms.get(roomId)?.user1;
        user1?.socket.emit("answer", { roomId, sdp });
    }
}