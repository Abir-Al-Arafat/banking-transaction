import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const socketService = {
  connect: (): Socket => {
    if (socket) return socket;
    socket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  onTransactionCreated: (callback: (data: unknown) => void) => {
    socket?.on("transaction:created", callback);
  },

  onBalanceUpdated: (callback: (data: unknown) => void) => {
    socket?.on("balance:updated", callback);
  },

  onTransactionFailed: (callback: (data: unknown) => void) => {
    socket?.on("transaction:failed", callback);
  },

  offTransactionCreated: () => {
    socket?.off("transaction:created");
  },

  offBalanceUpdated: () => {
    socket?.off("balance:updated");
  },

  offTransactionFailed: () => {
    socket?.off("transaction:failed");
  },
};
