"use client";

import "cropperjs/dist/cropper.css";
import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { Toaster } from "react-hot-toast";
import { withApplicationPlatform } from "@/components/form-ui/HOC";
import { TooltipProvider } from "@/components/ui/tooltip";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { notifyOnChangeProps: "all", refetchOnWindowFocus: false },
  },
});

const Application: FunctionComponent<{ children?: ReactNode }> = ({
  children,
}) => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default withApplicationPlatform()(Application);
