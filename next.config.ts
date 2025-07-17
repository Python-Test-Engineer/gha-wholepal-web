import createNextIntlPlugin from "next-intl/plugin";
import AutoImport from "unplugin-auto-import/webpack";
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3333",
        pathname: "/uploads/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "wholepal-platform-api-dev-769463201145.europe-west4.run.app",
        port: "",
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        API_URL: JSON.stringify(process.env.NEXT_PUBLIC_API_URL),
        APP_URL: JSON.stringify(process.env.NEXT_PUBLIC_APP_URL),
        SOCKET_URL: JSON.stringify(process.env.NEXT_PUBLIC_SOCKET_URL),
      })
    );
    config.plugins.push(
      AutoImport({
        eslintrc: {
          enabled: true,
        },
        imports: [
          "react",
          {
            "next-intl": ["NextIntlClientProvider", "useTranslations"],
          },
          {
            "react-hook-form": [
              "useForm",
              "useController",
              "useWatch",
              "useFieldArray",
              "FormProvider",
              "useFormContext",
            ],
          },
          {
            "lodash-es": [
              "get",
              "isEmpty",
              "isString",
              "isNumber",
              "forEach",
              "flatten",
              "map",
              "isUndefined",
              "range",
              "head",
              "reduce",
              "filter",
              "includes",
              "lowerCase",
              "orderBy",
              "find",
              "size",
              "camelCase",
              "groupBy",
              "keys",
              "toLower",
              "split",
              "some",
              "forEach",
              "trim",
              "isBoolean",
              "words",
              "every",
              "toNumber",
              "toPairs",
              "endsWith",
              "toString",
              "isArray",
              "join",
              "findLast",
              "kebabCase",
              "omitBy",
              "set",
              "values",
              "replace",
              "isNull",
              "last",
            ],
          },
          {
            "class-variance-authority": [["cva", "classVariant"]],
          },
          {
            from: "class-variance-authority",
            imports: ["VariantProps"],
            type: true,
          },
          {
            clsx: [["default", "clsx"]],
          },
          {
            from: "clsx",
            imports: ["ClassValue"],
            type: true,
          },
          {
            "tailwind-merge": ["twMerge"],
          },
          {
            "@tanstack/react-query": [
              "useMutation",
              "useQueries",
              "useQuery",
              "useQueryClient",
              "QueryClient",
              "QueryClientProvider",
              "useInfiniteQuery",
            ],
          },
          {
            from: "@tanstack/react-query",
            imports: [
              "QueryKey",
              "UseQueryOptions",
              "UseQueryResult",
              "QueriesResults",
              "QueriesOptions",
              "UseInfiniteQueryResult",
              "UseInfiniteQueryOptions",
              "QueryObserverResult",
            ],
            type: true,
          },
          {
            zustand: ["create"],
          },
          {
            from: "zustand",
            imports: ["StoreApi", "UseBoundStore", "StateCreator"],
            type: true,
          },
          {
            from: "react-hook-form",
            imports: [
              "Path",
              "PathValue",
              "FieldErrors",
              "Control",
              "RegisterOptions",
              "UseFormGetValues",
              "UseFormReturn",
              "FieldValues",
              "FieldArrayWithId",
              "UseFormSetValue",
              "UseFormSetError",
              "UseFormHandleSubmit",
            ],
            type: true,
          },
          {
            from: "react",
            imports: [
              "FunctionComponent",
              "ReactNode",
              "ReactElement",
              "Key",
              ["MouseEvent", "ReactMouseEvent"],
              ["KeyboardEvent", "ReactKeyboardEvent"],
              "ComponentType",
              "ComponentProps",
              "ChangeEvent",
              "Ref",
              "RefObject",
              "Dispatch",
              "SetStateAction",
              "CSSProperties",
            ],
            type: true,
          },
          {
            axios: [["default", "axios"]],
          },
          {
            from: "axios",
            imports: [
              "AxiosInstance",
              "AxiosResponse",
              "AxiosError",
              "InternalAxiosRequestConfig",
              "AxiosRequestConfig",
              "AxiosPromise",
            ],
            type: true,
          },
          {
            dayjs: [["default", "dayjs"]],
          },
          {
            from: "dayjs",
            imports: [
              "Dayjs",
              "QUnitType",
              "ConfigType",
              "OpUnitType",
              "ManipulateType",
            ],
            type: true,
          },
          {
            from: "next",
            imports: ["Metadata", "MetadataRoute"],
            type: true,
          },
        ],
        dirs: ["src/shared"],
        dts: "src/types/auto-imports.d.ts",
      })
    );
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
