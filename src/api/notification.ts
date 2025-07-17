export const getNotifications = (): Promise<
  NotificationManagement.NotificationItem[]
> => useHttpRequest({ url: "/notifications" });

export const markAllRead = (): Promise<void> =>
  useHttpRequest({ url: "/notifications/mark-all-read", method: "PATCH" });

export const markRead = (id: string): Promise<void> =>
  useHttpRequest({ url: `/notifications/${id}/mark-read`, method: "PATCH" });
