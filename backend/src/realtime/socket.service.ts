import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import {
  BalanceUpdatedPayload,
  SOCKET_EVENTS,
  TransactionCreatedPayload,
  TransactionFailedPayload,
} from "./socket.events";

export class SocketService {
  private io: SocketIOServer | null = null;

  initialize(server: HttpServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  emitTransactionCreated(payload: TransactionCreatedPayload): void {
    if (!this.io) {
      return;
    }

    this.io.emit(SOCKET_EVENTS.TRANSACTION_CREATED, payload);
  }

  emitBalanceUpdated(payload: BalanceUpdatedPayload): void {
    if (!this.io) {
      return;
    }

    this.io.emit(SOCKET_EVENTS.BALANCE_UPDATED, payload);
  }

  emitTransactionFailed(payload: TransactionFailedPayload): void {
    if (!this.io) {
      return;
    }

    this.io.emit(SOCKET_EVENTS.TRANSACTION_FAILED, payload);
  }
}

export const socketService = new SocketService();
