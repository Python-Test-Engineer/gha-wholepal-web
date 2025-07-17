import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LANGUAGE } from "@/config/constants";

export default getRequestConfig(async () => {
  const locale = DEFAULT_LANGUAGE;

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default,
  };
});
