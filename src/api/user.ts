export const getUserInfo = (): Promise<Auth.User> =>
  useHttpRequest({ url: "/users/profile" });

export const updateUserInfo = (data: Auth.UpdateUserData): Promise<Auth.User> =>
  useHttpRequest({ url: "/users/profile", method: "PATCH", data });

export const updatePassword = (
  oldPassword: string,
  password: string
): Promise<void> =>
  useHttpRequest({
    url: "/users/password",
    method: "PATCH",
    data: { oldPassword, password },
  });
