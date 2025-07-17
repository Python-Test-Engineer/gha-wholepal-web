declare namespace NotificationManagement {
  import("@/enums/notification");
  import { NotificationTypeEnum } from "@/enums/notification";

  interface NotificationData extends App.Entity {
    type: NotificationTypeEnum;
    data: {
      companyId: string;
      productId: string;
      companyName: string;
      productVersionId?: string;
      productName?: string;
      supplierName?: string;
      productConnectId?: string;
    };
  }

  interface NotificationItem extends App.Entity {
    notificationId: string;
    userId: string;
    isRead: boolean;
    notification: NotificationData;
  }
}
