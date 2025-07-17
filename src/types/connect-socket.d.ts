declare namespace ConnectSocket {
  import("@/enums/notification");
  import { NotificationTypeEnum } from "@/enums/notification";
  type Config = {
    token: string;
    userId: string;
  };

  interface SocketResponse {
    type: NotificationTypeEnum;
    room: string;
  }
}
