import { login } from "@/api/auth";
import type { SetState, Actions, State } from "./types";
import { getUserInfo } from "@/api/user";

const { setAccessToken, setUserInfo, revokeUser } = useCookie();
const { connect, leftRoom } = useSocket();

const createAction = (set: SetState<State>): Actions => ({
  login: async (credentials: Auth.UserCertificate): Promise<void> => {
    const { accessToken, user } = await login(credentials);
    setAccessToken(accessToken);
    setUserInfo(user);
    set(() => ({ accessToken: accessToken, userInfo: user }));
    connect({ token: accessToken, userId: user.id });
  },
  getUserInfo: async (): Promise<Auth.User> => {
    const response = await getUserInfo();
    set(() => ({ userInfo: response }));
    return response;
  },
  logout: () => {
    revokeUser();
    set({ accessToken: null, userInfo: null });
    windowRedirect("/login");
    leftRoom();
  },
});

export default createAction;
