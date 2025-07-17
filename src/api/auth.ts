export const login = (
  data: Auth.UserCertificate
): Promise<Auth.UserAuthentication> =>
  useHttpRequest({ url: "/auth/login", method: "POST", data });

export const register = (data: Auth.RegisterData): Promise<void> =>
  useHttpRequest({ url: "/auth/register", method: "POST", data });

export const requestJoinCompany = (
  data: Auth.RequestJoinCompanyData
): Promise<void> =>
  useHttpRequest({ url: "/auth/request-invitation", method: "POST", data });
