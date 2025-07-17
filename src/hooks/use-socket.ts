import { io, Socket } from "socket.io-client";
import EventEmitter from "eventemitter3";
import {
  DisconnectEventEnum,
  NotificationEnum,
  RoomEventEnum,
} from "@/enums/socket-connect";

let socket: Socket = null;
let config: ConnectSocket.Config = null;
let eventEmitter: EventEmitter = null;
let isConnected = false;
let isRefreshing = false;

const useSocket = () => {
  const { getAccessToken } = useCookie();

  if (!socket) {
    socket = io(SOCKET_URL || API_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: false,
      query: { token: null },
    });
  }
  if (!eventEmitter) {
    eventEmitter = new EventEmitter();
  }

  const connect = (socketConfig: ConnectSocket.Config): void => {
    if (socket && !isConnected) {
      isConnected = true;
      config = socketConfig;
      socket.io.opts.query.token = config.token;
      socket.connect();
      handleSocketEvent();
      handleSocketRoomEvent();
      handleReceivedSocketEvent();
    }
  };

  const reconnect = (): void => {
    if (socket) {
      socket.connect();
    }
  };

  const reconnectSocketChannel = (): void => {
    const token = getAccessToken();
    socket.io.opts.query.token = token;
    socket.connect();
    isConnected = true;
    handleSocketEvent();
    handleSocketRoomEvent();
    handleReceivedSocketEvent();
  };

  const on = <T>(event: string, fn: (data?: T) => void): void => {
    eventEmitter.on(event, fn);
  };

  const off = (event: string): void => {
    eventEmitter.off(event);
  };

  const removeAllListeners = (): void => {
    socket.off("connect");
    socket.off(RoomEventEnum.JOIN_ROOM);
    socket.off(RoomEventEnum.LEFT_ROOM);
    socket.off(RoomEventEnum.ERROR);
    socket.off(NotificationEnum.PRODUCT_EVENT);
    socket.off(NotificationEnum.COMPANY_EVENT);
    socket.off(NotificationEnum.DOCUMENT_EVENT);
    eventEmitter.removeAllListeners();
    isConnected = false;
  };

  const joinRoom = (): void => {
    if (isConnected) {
      socket.emit(RoomEventEnum.JOIN_ROOM, {
        room: `user.${config.userId}`,
      });
    }
  };

  const leftRoom = (): void => {
    if (isConnected) {
      socket.emit(RoomEventEnum.LEFT_ROOM, {
        room: `user.${config.userId}`,
      });
      disconnect();
    }
  };

  const handleSocketEvent = (): void => {
    socket.on("connect", () => {
      joinRoom();
    });
    socket.on("connect_error", () => {
      // connect error
    });
    socket.on("disconnect", (reason: string) => {
      if (reason === DisconnectEventEnum.SERVER_DISCONNECT) {
        reconnect();
      }
      if (reason === DisconnectEventEnum.CLIENT_DISCONNECT) {
        removeAllListeners();
        if (isRefreshing) {
          reconnectSocketChannel();
          isRefreshing = false;
        }
      }
    });
    socket.on("reconnect", () => {
      // reconnect
    });
    socket.on("reconnect_error", () => {
      // reconnect error
    });
    socket.on("reconnect_failed", () => {
      // reconnect failed
    });
    socket.on("reconnect_attempt", () => {
      // reconnect attempt
    });
    socket.on("error", () => {
      // socket error
    });
  };

  const handleSocketRoomEvent = (): void => {
    socket.on(RoomEventEnum.JOIN_ROOM, () => {
      // user join room success
    });
    socket.on(RoomEventEnum.LEFT_ROOM, () => {
      // user left room success
    });
    socket.on(RoomEventEnum.ERROR, () => {
      // join room error
    });
  };

  const handleReceivedSocketEvent = (): void => {
    socket.on(NotificationEnum.PRODUCT_EVENT, (data) =>
      eventEmitter.emit(NotificationEnum.PRODUCT_EVENT, data)
    );
    socket.on(NotificationEnum.COMPANY_EVENT, (data) =>
      eventEmitter.emit(NotificationEnum.COMPANY_EVENT, data)
    );
    socket.on(NotificationEnum.DOCUMENT_EVENT, (data) =>
      eventEmitter.emit(NotificationEnum.DOCUMENT_EVENT, data)
    );
  };

  const disconnect = (refreshing: boolean = false): void => {
    if (isConnected) {
      if (refreshing) {
        isRefreshing = refreshing;
      }
      socket.disconnect();
    }
  };

  return { connect, leftRoom, on, off };
};

export default useSocket;
