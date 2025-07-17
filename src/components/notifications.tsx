"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  BellOff,
  ChevronsUpDown,
  Package,
  FileSearch,
  CircleCheck,
  Ban,
  FileCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getNotifications, markAllRead, markRead } from "@/api/notification";
import { updateConnectStatus } from "@/api/product";
import { NotificationTypeEnum } from "@/enums/notification";
import { NotificationEnum } from "@/enums/socket-connect";
import { ProductConnectStatusEnum } from "@/enums/product";

const Notifications: FunctionComponent = () => {
  const t = useTranslations();
  const router = useRouter();
  const { timeAgo } = useDateTime();
  const { on, off } = useSocket();
  const [notificationCount, setNotificationCount] = useState(0);

  const { data, isError, error, isSuccess, refetch } = useRequest({
    queryKey: ["getNotifications"],
    queryFn: getNotifications,
  });

  const updateConnectStatusMutation = useMutation({
    mutationFn: ({
      productVersionId,
      status,
      companyId,
      notificationId,
    }: {
      productVersionId: string;
      status: ProductConnectStatusEnum;
      companyId: string;
      notificationId: string;
    }) =>
      updateConnectStatus(productVersionId, {
        status,
        companyId,
        notificationId,
      }),
    onSuccess: (data, variables) => {
      refetch();
      setNotificationCount((prev) => prev - 1);
      if (variables.status === ProductConnectStatusEnum.APPROVED) {
        toast.success(t("accepted"));
      } else {
        toast.success(t("declined"));
      }
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      refetch();
      setNotificationCount(0);
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  const markReadMutation = useMutation({
    mutationFn: markRead,
    onSuccess: () => {
      refetch();
      setNotificationCount((prev) => prev - 1);
    },
    onError: (error: App.ResponseError) => toast.error(error.message),
  });

  useEffect(() => {
    if (isSuccess) {
      const count = reduce(
        data,
        (acc, cur) => (!cur.isRead ? acc + 1 : acc),
        0
      );
      setNotificationCount(count);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError]);

  useEffect(() => {
    on(NotificationEnum.PRODUCT_EVENT, () => {
      refetch();
      setNotificationCount((prev) => prev + 1);
    });
    on(NotificationEnum.COMPANY_EVENT, () => {
      refetch();
      setNotificationCount((prev) => prev + 1);
    });
    on(NotificationEnum.DOCUMENT_EVENT, () => {
      refetch();
      setNotificationCount((prev) => prev + 1);
    });
    return () => {
      off(NotificationEnum.PRODUCT_EVENT);
      off(NotificationEnum.COMPANY_EVENT);
      off(NotificationEnum.DOCUMENT_EVENT);
    };
  }, []);

  const updateStatus = (
    notificationData: NotificationManagement.NotificationData,
    status: ProductConnectStatusEnum
  ): void => {
    updateConnectStatusMutation.mutate({
      productVersionId: notificationData.data.productVersionId,
      status,
      companyId: notificationData.data.companyId,
      notificationId: notificationData.id,
    });
  };

  const markAsRead = (
    notification: NotificationManagement.NotificationItem
  ): void => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
  };

  const getNotificationIcon = (
    notification: NotificationManagement.NotificationItem
  ) => {
    switch (notification.notification.type) {
      case NotificationTypeEnum.WHOLESALER_PRODUCT_REQUEST_CONNECT:
      case NotificationTypeEnum.PRODUCT_VERSION_PUBLISHED:
      case NotificationTypeEnum.PRODUCT_PROCESS_COMPLETED:
        return <Package className="h-5 w-5 text-gray-500" />;
      case NotificationTypeEnum.DOCUMENT_SHARED:
        return <FileSearch className="h-5 w-5 text-gray-500" />;
      case NotificationTypeEnum.SUPPLIER_INVITE_ACCEPTED:
      case NotificationTypeEnum.WHOLESALER_PRODUCT_CONNECT_ACCEPTED:
        return <CircleCheck className="h-5 w-5 text-primary" />;
      case NotificationTypeEnum.WHOLESALER_PRODUCT_CONNECT_REJECTED:
        return <Ban className="h-5 w-5 text-destructive" />;
      case NotificationTypeEnum.NLF_PROCESS_COMPLETE:
        return <FileCheck className="h-5 w-5 text-primary" />;

      default:
        return null;
    }
  };

  const getNotificationTitle = (
    notification: NotificationManagement.NotificationItem
  ) => {
    switch (notification.notification.type) {
      case NotificationTypeEnum.WHOLESALER_PRODUCT_REQUEST_CONNECT:
        return t("new_product_request");
      case NotificationTypeEnum.PRODUCT_VERSION_PUBLISHED:
        return t("new_version_released");
      case NotificationTypeEnum.PRODUCT_PROCESS_COMPLETED:
        return t("products_processed");
      case NotificationTypeEnum.SUPPLIER_INVITE_ACCEPTED:
        return t("invitation_accepted");
      case NotificationTypeEnum.WHOLESALER_PRODUCT_CONNECT_ACCEPTED:
        return t("product_connection_accepted");
      case NotificationTypeEnum.WHOLESALER_PRODUCT_CONNECT_REJECTED:
        return t("product_connection_rejected");
      case NotificationTypeEnum.DOCUMENT_SHARED:
        return t("document_shared");
      case NotificationTypeEnum.NLF_PROCESS_COMPLETE:
        return t("nlf_process_completed");
      default:
        return null;
    }
  };

  const getNotificationDescription = (
    notificationData: NotificationManagement.NotificationData
  ) => {
    switch (notificationData.type) {
      case NotificationTypeEnum.WHOLESALER_PRODUCT_REQUEST_CONNECT:
        return t.rich("wholesaler_has_request_to_add_your_product", {
          wholesaler: get(notificationData, "data.companyName"),
          product: (chunk) => (
            <Link
              href={`/product-versions/${get(
                notificationData,
                "data.productVersionId"
              )}`}
              className="text-primary hover:underline"
            >
              {chunk}
            </Link>
          ),
        });
      case NotificationTypeEnum.PRODUCT_VERSION_PUBLISHED:
        return t.rich("new_version_released_description", {
          productName: get(notificationData, "data.productName"),
          supplierName: get(notificationData, "data.supplierName"),
          product: (chunk) => <span className="font-semibold">{chunk}</span>,
          supplier: (chunk) => <span className="font-semibold">{chunk}</span>,
        });
      case NotificationTypeEnum.PRODUCT_PROCESS_COMPLETED:
        return t("ai_has_finished_processing_your_documents");
      case NotificationTypeEnum.SUPPLIER_INVITE_ACCEPTED:
        return t.rich("invitation_accepted_description", {
          supplierName: get(notificationData, "data.supplierName"),
          supplier: (chunk) => <span className="font-semibold">{chunk}</span>,
        });
      case NotificationTypeEnum.WHOLESALER_PRODUCT_CONNECT_ACCEPTED:
        return t.rich("product_connection_accepted_description", {
          supplierName: get(notificationData, "data.companyName"),
          supplier: (chunk) => <span className="font-semibold">{chunk}</span>,
          product: (chunk) => (
            <Link
              href={`/product-versions/${get(
                notificationData,
                "data.productVersionId"
              )}`}
              className="text-primary hover:underline"
            >
              {chunk}
            </Link>
          ),
        });
      case NotificationTypeEnum.WHOLESALER_PRODUCT_CONNECT_REJECTED:
        return t.rich("product_connection_rejected_description", {
          supplierName: get(notificationData, "data.companyName"),
          supplier: (chunk) => <span className="font-semibold">{chunk}</span>,
          product: (chunk) => (
            <Link
              href={`/product-versions/${get(
                notificationData,
                "data.productVersionId"
              )}`}
              className="text-primary hover:underline"
            >
              {chunk}
            </Link>
          ),
        });
      case NotificationTypeEnum.DOCUMENT_SHARED:
        return t.rich("document_shared_description", {
          supplierName: get(notificationData, "data.supplierName"),
          supplier: (chunk) => <span className="font-semibold">{chunk}</span>,
        });
      case NotificationTypeEnum.NLF_PROCESS_COMPLETE:
        return t("nlf_process_completed_description");
      default:
        return null;
    }
  };

  const renderActions = (
    notification: NotificationManagement.NotificationItem
  ): React.JSX.Element => {
    if (
      notification.notification.type ===
      NotificationTypeEnum.WHOLESALER_PRODUCT_REQUEST_CONNECT
    ) {
      return (
        <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-primary"
            onClick={(e) => {
              e.stopPropagation();
              updateStatus(
                notification.notification,
                ProductConnectStatusEnum.APPROVED
              );
            }}
          >
            {t("accept")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              updateStatus(
                notification.notification,
                ProductConnectStatusEnum.REJECTED
              );
            }}
          >
            {t("decline")}
          </Button>
        </div>
      );
    }
    if (
      notification.notification.type ===
      NotificationTypeEnum.PRODUCT_VERSION_PUBLISHED
    ) {
      return (
        <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-primary"
            onClick={() =>
              router.push(
                `/product-versions/${get(
                  notification,
                  "notification.data.productVersionId"
                )}`
              )
            }
          >
            {t("check_it_out")}
          </Button>
        </div>
      );
    }
    if (
      notification.notification.type === NotificationTypeEnum.DOCUMENT_SHARED
    ) {
      return (
        <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-primary"
            onClick={() => router.push("/documents")}
          >
            {t("check_it_out")}
          </Button>
        </div>
      );
    }
    if (
      notification.notification.type ===
      NotificationTypeEnum.NLF_PROCESS_COMPLETE
    ) {
      return (
        <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-primary"
            onClick={() => router.push("/downloads")}
          >
            {t("check_it_out")}
          </Button>
        </div>
      );
    }

    if (
      notification.notification.type ===
      NotificationTypeEnum.PRODUCT_PROCESS_COMPLETED
    ) {
      return (
        <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-primary"
            onClick={() => router.push("/products")}
          >
            {t("check_it_out")}
          </Button>
        </div>
      );
    }
    return null;
  };

  const renderNotification = (
    notification: NotificationManagement.NotificationItem
  ) => {
    return (
      <div
        key={notification.id}
        className={cn(
          "relative flex items-start p-3 rounded-md mb-1 transition-colors group",
          notification.isRead
            ? "bg-background hover:bg-muted/40"
            : "bg-accent/20 hover:bg-accent/30"
        )}
        onClick={() => markAsRead(notification)}
      >
        <div className="absolute -left-0.5 top-0 bottom-0 w-1 rounded-full bg-transparent">
          {!notification.isRead && (
            <div className="absolute top-3 left-0 w-1 h-4 bg-primary rounded-full" />
          )}
        </div>

        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            {getNotificationIcon(notification)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4
              className={cn(
                "text-sm font-medium text-ellipsis",
                notification.isRead ? "text-foreground" : "text-foreground"
              )}
            >
              {getNotificationTitle(notification)}
            </h4>
            <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">
              {timeAgo(notification.createdAt)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {getNotificationDescription(notification.notification)}
          </p>

          {renderActions(notification)}
        </div>
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-6 h-6 text-foreground" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-primary text-xs text-white items-center justify-center font-medium">
                {notificationCount}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px]" forceMount>
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel className="text-base font-medium">
            Notifications
          </DropdownMenuLabel>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => markAllReadMutation.mutate()}
              disabled={notificationCount === 0}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronsUpDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuRadioGroup value="all">
                  <DropdownMenuRadioItem value="all">
                    All notifications
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="unread">
                    Unread only
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <BellOff className="h-4 w-4 mr-2" />
                  Mute all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[350px]">
          <div className="p-1">
            {size(data) > 0 ? (
              map(data, renderNotification)
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BellOff className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground">
                  No notifications
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DropdownMenuSeparator />
        <div className="p-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center text-sm"
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
