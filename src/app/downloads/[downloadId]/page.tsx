"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Info,
  Download,
  MessageSquare,
  FileText,
  Bell,
  Search,
  Copy,
  RefreshCw,
  FileDown,
  Clock,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Link2,
  Eye,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import Image from "next/image";

const generateMockDownload = (id: string) => {
  const statuses = ["Completed", "In Progress", "Failed", "Pending"];
  const fileTypes = [
    "Invoice",
    "Product Catalog",
    "Price List",
    "Contract",
    "Delivery Note",
  ];
  const customers = [
    "Oceanside Retail",
    "Metro Supermarkets",
    "Golden Foods Co.",
    "Fresh Market Chain",
    "North Valley Stores",
  ];

  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));

  const fileSizeKB = Math.floor(Math.random() * 25000) + 100;
  const fileSize =
    fileSizeKB >= 1000
      ? `${(fileSizeKB / 1000).toFixed(2)} MB`
      : `${fileSizeKB} KB`;

  const statusId = Math.floor(Math.random() * statuses.length);
  const fileTypeId = Math.floor(Math.random() * fileTypes.length);
  const customerId = Math.floor(Math.random() * customers.length);

  return {
    id: id,
    fileName: `${fileTypes[fileTypeId]}_${id.toString().padStart(4, "0")}.pdf`,
    status: statuses[statusId],
    customer: customers[customerId],
    recipientEmail: `contact@${customers[customerId]
      .toLowerCase()
      .replace(/\s+/g, "")}.com`,
    downloadDate: date.toISOString(),
    expiryDate: new Date(
      date.getTime() + 1000 * 60 * 60 * 24 * 30
    ).toISOString(),
    fileSize: fileSize,
    downloadCount: Math.floor(Math.random() * 10),
    fileType: fileTypes[fileTypeId],
    securityLevel: ["Public", "Private", "Restricted"][
      Math.floor(Math.random() * 3)
    ],
    createdBy: ["John Smith", "Sarah Johnson", "Michael Brown"][
      Math.floor(Math.random() * 3)
    ],
    lastAccessed: new Date(
      date.getTime() + 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 10)
    ).toISOString(),
    downloadLink: `https://example.com/download/${id}`,
    notes:
      "This file contains important information required for the customer's current order processing.",
    thumbnailUrl: "/document-thumbnail.jpg",
  };
};

export default function DownloadDetails() {
  const router = useRouter();
  const params = useParams();
  const [download, setDownload] = useState(null);
  const [activeTab, setActiveTab] = useState("Download details");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const downloadId = params.downloadId;

  const tabs = [
    { id: "Download details", icon: <FileText className="h-5 w-5" /> },
    { id: "Access logs", icon: <Eye className="h-5 w-5" /> },
    { id: "Sharing settings", icon: <Users className="h-5 w-5" /> },
    { id: "Analytics", icon: <RefreshCw className="h-5 w-5" /> },
    { id: "Related files", icon: <Link2 className="h-5 w-5" /> },
    { id: "Custom metadata", icon: <Info className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const fetchDownloadData = async () => {
      if (!downloadId) return;

      setIsLoading(true);
      setError("");

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const foundDownload = generateMockDownload(parseInt(downloadId));

        if (!foundDownload) {
          throw new Error("Download not found");
        }

        setDownload(foundDownload);
      } catch (err) {
        setError(err.message || "Failed to load download details");
        console.error("Error fetching download details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloadData();
  }, [downloadId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <CheckCircle className="h-3 w-3" />
            {status}
          </span>
        );
      case "In Progress":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            <Clock className="h-3 w-3" />
            {status}
          </span>
        );
      case "Failed":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            <XCircle className="h-3 w-3" />
            {status}
          </span>
        );
      case "Pending":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            <Clock className="h-3 w-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
          <div className="text-destructive text-xl mb-4">Error: {error}</div>
          <Button
            onClick={() => router.push("/downloads")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Back to Downloads
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Header Section */}
        <div className="bg-card p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-foreground flex items-center mr-4"
              onClick={() => router.push("/downloads")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {download?.fileName}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Downloads"
                className="w-64 bg-muted border-none rounded-full pl-10 text-foreground placeholder:text-muted-foreground h-9"
              />
            </div>

            <Button variant="outline" className="border-border text-foreground">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Link
            </Button>

            <Button className="bg-card border border-border text-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message recipient
            </Button>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <FileDown className="h-4 w-4 mr-2" />
              Download
            </Button>

            <div className="flex items-center gap-4 ml-2">
              <Bell className="h-5 w-5 text-foreground/80" />
              <div className="w-8 h-8 bg-muted-foreground rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - File Preview & Quick Info */}
            <div className="lg:col-span-3">
              {/* File Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-lg overflow-hidden mb-6"
              >
                <div className="p-3 bg-background text-foreground font-medium">
                  File Preview
                </div>
                <div className="p-3">
                  <div className="relative h-48 w-full bg-muted rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      {download?.thumbnailUrl ? (
                        <Image
                          src={download.thumbnailUrl}
                          alt={download.fileName}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <FileText className="h-16 w-16 text-muted-foreground mb-2" />
                          <div className="text-center text-muted-foreground text-sm">
                            Preview not available
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Download Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-card rounded-lg overflow-hidden"
              >
                <div className="p-3 bg-background text-foreground font-medium">
                  Quick Download Overview
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-2 text-muted-foreground">
                          File name:
                        </td>
                        <td className="py-2 text-foreground">
                          {download?.fileName}
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 text-muted-foreground">Status:</td>
                        <td className="py-2 text-foreground">
                          {getStatusBadge(download?.status)}
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 text-muted-foreground">
                          Customer:
                        </td>
                        <td className="py-2 text-foreground">
                          {download?.customer}
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 text-muted-foreground">
                          File size:
                        </td>
                        <td className="py-2 text-foreground">
                          {download?.fileSize}
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 text-muted-foreground">
                          Downloads:
                        </td>
                        <td className="py-2 text-foreground">
                          {download?.downloadCount} times
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-muted-foreground align-top">
                          Created:
                        </td>
                        <td className="py-2 text-foreground">
                          {formatDate(download?.downloadDate)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Tabs & Form */}
            <div className="lg:col-span-9">
              {/* Tabs Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 grid grid-cols-3 md:grid-cols-6 gap-3"
              >
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center h-20 border ${
                      activeTab === tab.id
                        ? "border-primary text-foreground bg-card"
                        : "border-border text-foreground/80 bg-card"
                    }`}
                  >
                    <div className="mb-1">{tab.icon}</div>
                    <div className="text-xs text-center">{tab.id}</div>
                  </Button>
                ))}
              </motion.div>

              {/* Download Details Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-card p-6 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Name */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label
                        htmlFor="fileName"
                        className="text-foreground/80 text-sm"
                      >
                        File Name
                      </label>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                      <div className="ml-auto">
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <Input
                      id="fileName"
                      value={download?.fileName}
                      onChange={() => {}}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* File Type */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label
                        htmlFor="fileType"
                        className="text-foreground/80 text-sm"
                      >
                        File Type
                      </label>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                      <div className="ml-auto">
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <Input
                      id="fileType"
                      value={download?.fileType}
                      onChange={() => {}}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Recipient Email */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label
                        htmlFor="recipientEmail"
                        className="text-foreground/80 text-sm"
                      >
                        Recipient Email
                      </label>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                      <div className="ml-auto">
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <Input
                      id="recipientEmail"
                      value={download?.recipientEmail}
                      onChange={() => {}}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Security Level */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label
                        htmlFor="securityLevel"
                        className="text-foreground/80 text-sm"
                      >
                        Security Level
                      </label>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                      <div className="ml-auto">
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <Input
                      id="securityLevel"
                      value={download?.securityLevel}
                      onChange={() => {}}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Created By */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label
                        htmlFor="createdBy"
                        className="text-foreground/80 text-sm"
                      >
                        Created By
                      </label>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                      <div className="ml-auto">
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <Input
                      id="createdBy"
                      value={download?.createdBy}
                      onChange={() => {}}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <div className="flex items-center mb-2">
                      <label
                        htmlFor="expiryDate"
                        className="text-foreground/80 text-sm"
                      >
                        Expiry Date
                      </label>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                      <div className="ml-auto">
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <Input
                      id="expiryDate"
                      value={formatDate(download?.expiryDate)}
                      onChange={() => {}}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Download Link */}
                  <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                      <label
                        htmlFor="downloadLink"
                        className="text-foreground/80 text-sm"
                      >
                        Download Link
                      </label>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                      <div className="ml-auto">
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="downloadLink"
                        value={download?.downloadLink}
                        onChange={() => {}}
                        className="bg-background border-border text-foreground flex-grow"
                      />
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                      <label
                        htmlFor="notes"
                        className="text-foreground/80 text-sm"
                      >
                        Notes
                      </label>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                      <div className="ml-auto">
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <textarea
                      id="notes"
                      value={download?.notes}
                      onChange={() => {}}
                      className="w-full h-24 bg-background border-border text-foreground rounded-md p-2 resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-foreground text-lg font-medium mb-4">
                    Activity Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="w-0.5 h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center text-foreground font-medium">
                          File created
                          <span className="ml-auto text-sm text-muted-foreground">
                            {formatDate(download?.downloadDate)}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                          {download?.createdBy} created this file and made it
                          available for download.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="w-0.5 h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center text-foreground font-medium">
                          First accessed
                          <span className="ml-auto text-sm text-muted-foreground">
                            {formatDate(
                              new Date(
                                new Date(download?.downloadDate).getTime() +
                                  1000 * 60 * 60 * 2
                              )
                            )}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                          The file was first accessed by {download?.customer}.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Download className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center text-foreground font-medium">
                          Last downloaded
                          <span className="ml-auto text-sm text-muted-foreground">
                            {formatDate(download?.lastAccessed)}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                          The file was downloaded from IP 192.168.1.1.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
