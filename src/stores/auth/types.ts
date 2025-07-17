export interface State {
  userInfo: Auth.User;
  accessToken: string;
}

export type Actions = {
  login: (credentials: Auth.UserCertificate) => Promise<void>;
  logout: () => void;
  getUserInfo: () => Promise<Auth.User>;
};

export type SetState<T extends State> = {
  _(
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean | undefined,
    actionName?: string
  ): void;
}["_"];
