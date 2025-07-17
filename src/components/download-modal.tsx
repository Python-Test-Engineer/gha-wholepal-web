/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Download, Check, AlertCircle } from "lucide-react";

const DownloadModal = ({ isOpen, onClose, productName, onDownload }: any) => {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleDownload = async () => {
    setStatus("loading");
    try {
      await onDownload();
      setStatus("success");
      // Auto close after success
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to download CSV file");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Export Product Data
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Download product information as a CSV file
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          {status === "idle" && (
            <>
              <Download className="h-16 w-16 text-primary mb-4" />
              <p className="text-center text-foreground">
                Ready to export{" "}
                <span className="font-medium">{productName}</span>
              </p>
              <p className="text-center text-muted-foreground mt-2">
                The file will be downloaded to your device
              </p>
            </>
          )}

          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <p className="text-center text-foreground">
                Preparing download...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 mb-4">
                <Check className="h-12 w-12 text-green-600 dark:text-green-500" />
              </div>
              <p className="text-center text-foreground">Download complete!</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2 mb-4">
                <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
              </div>
              <p className="text-center text-foreground">Download failed</p>
              <p className="text-center text-muted-foreground mt-2">
                {errorMessage}
              </p>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-center">
          {status === "idle" && (
            <>
              <Button variant="outline" onClick={handleClose} className="mr-2">
                Cancel
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </>
          )}

          {status === "loading" && (
            <Button disabled className="bg-primary text-primary-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Downloading...
            </Button>
          )}

          {(status === "success" || status === "error") && (
            <Button
              onClick={handleClose}
              variant={status === "error" ? "outline" : "ghost"}
            >
              {status === "success" ? "Close" : "Try again"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
