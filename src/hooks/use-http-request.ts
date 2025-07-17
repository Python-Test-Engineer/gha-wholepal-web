import { DEFAULT_LANGUAGE } from "@/config/constants";
import { StatusCodeEnum } from "@/enums/app";

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
};
let instance: AxiosInstance = null;

const handleRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const { getAccessToken } = useCookie();
  try {
    config.headers.Language = DEFAULT_LANGUAGE;

    if (!isEmpty(getAccessToken())) {
      config.headers.Authorization = `Bearer ${getAccessToken()}`;
    }

    return config;
  } catch (error) {
    throw new Error(error as string);
  }
};

const handleResponseSuccess = (response: AxiosResponse) => {
  return response.data;
};

const getErrorData = async (error: AxiosError<App.ResponseError>) => {
  const data = get(error, "response.data");
  if (data instanceof Blob) {
    try {
      const text = await data.text();
      return JSON.parse(text);
    } catch {
      return {};
    }
  }
  return data;
};

const handleResponseError = async (error: AxiosError<App.ResponseError>) => {
  const { revokeUser, getUserInfo } = useCookie();
  const userInfo = getUserInfo();
  const pathname = window.location.pathname;
  const status = get(error, "response.status");
  const errorData = await getErrorData(error);

  switch (status) {
    case StatusCodeEnum.ValidationFailed:
    case StatusCodeEnum.GoneRequest:
    case StatusCodeEnum.PreconditionFailed:
    case StatusCodeEnum.BadRequest: {
      return Promise.reject({ ...errorData, status } as Error);
    }
    case StatusCodeEnum.Unauthorized: {
      if (!isEmpty(userInfo) || pathname != "/login") {
        revokeUser();
        windowRedirect("/login");
      }
      break;
    }
    case StatusCodeEnum.Forbidden: {
      // windowRedirect('/403');
      break;
    }
    case StatusCodeEnum.PageNotFound: {
      // windowRedirect('/404');
      break;
    }
    case StatusCodeEnum.TooManyRequests: {
      break;
    }
  }
  return Promise.reject({ ...errorData, status } as Error);
};

export default function useHttpRequest<T>(
  config: Partial<AxiosRequestConfig>
): Promise<T> {
  if (!instance) {
    instance = axios.create({
      baseURL: API_URL,
      headers,
    });

    instance.interceptors.request.use(handleRequest, (error: AxiosError) =>
      Promise.reject(error)
    );

    instance.interceptors.response.use(
      handleResponseSuccess,
      handleResponseError
    );
  }

  return instance(config.url, config);
}
