import UniversalCookie from "universal-cookie";

let cookie: UniversalCookie = null;

export default function useCookie() {
  const { clearAllSessionStorage } = useStorage();
  if (!cookie) {
    cookie = new UniversalCookie();
  }

  const options = {
    path: "/",
  };

  const setUserInfo = (data: Auth.User): void => {
    cookie.set("userInfo", data, options);
  };

  const getUserInfo = (): Auth.User => {
    return cookie.get("userInfo");
  };

  const setAccessToken = (token: string): void => {
    cookie.set("token", token, options);
  };

  const getAccessToken = (): string => {
    return cookie.get("token");
  };

  const isAuthenticated = (): boolean => {
    const userInfo = getUserInfo();
    const token = getAccessToken();
    return !!userInfo && !!token;
  };

  const revokeUser = (): void => {
    clearAllSessionStorage();
    cookie.remove("userInfo", options);
    cookie.remove("token", options);
  };

  return {
    getUserInfo,
    revokeUser,
    isAuthenticated,
    setUserInfo,
    setAccessToken,
    getAccessToken,
  };
}
