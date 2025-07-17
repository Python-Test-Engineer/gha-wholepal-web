export const getFile = (url: string): Promise<AxiosResponse> =>
  axios.get(url, { responseType: "blob" });
