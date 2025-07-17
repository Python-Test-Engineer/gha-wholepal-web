"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Shield,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Loader2,
  Lock,
  Copy,
  Camera,
  Briefcase,
  KeyRound,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-hot-toast";
import { getUserInfo, updatePassword } from "@/api/user";
import useAuthStore from "@/stores/auth";
import { StatusCodeEnum } from "@/enums/app";
import PersonalInfo from "./personal-info";

export default function Profile() {
  const router = useRouter();
  const logout = useAuthStore.use.logout();
  const { formatDate } = useDateTime();

  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [user, setUser] = useState<Auth.User>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await getUserInfo();
        setUser(response);
      } catch (error: App.ResponseError) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate password match in real-time
    if (name === "confirmPassword" || name === "newPassword") {
      if (name === "confirmPassword" && value !== passwordForm.newPassword) {
        setPasswordErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else if (
        name === "newPassword" &&
        passwordForm.confirmPassword &&
        value !== passwordForm.confirmPassword
      ) {
        setPasswordErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else if (
        (name === "confirmPassword" && value === passwordForm.newPassword) ||
        (name === "newPassword" &&
          passwordForm.confirmPassword &&
          value === passwordForm.confirmPassword)
      ) {
        setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswordForm()) return;

    setSaving(true);
    try {
      await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSaveSuccess(true);

      toast.success("Your password has been updated successfully");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: App.ResponseError) {
      if (error.status === StatusCodeEnum.BadRequest) {
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: "Current password is incorrect",
        });
      } else {
        toast.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-background min-h-screen pb-12">
        {/* Header */}
        <div className="bg-transparent">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  My Profile
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Success Message */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Your changes have been saved successfully!
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Profile Overview */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Card */}
              <Card className="overflow-hidden border-border">
                <div className="bg-primary/5 h-32 relative"></div>
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-36 z-100">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-card shadow-md">
                        <AvatarImage src="" alt={user?.fullName || ""} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {getUserInitials(user?.fullName || "User")}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-20 text-center">
                    <div className="flex flex-col items-center justify-center mb-4">
                      <h2 className="text-xl font-bold text-foreground">
                        {user?.fullName}
                      </h2>
                      <Badge
                        variant="outline"
                        className="mt-2 bg-primary/5 text-primary border-primary/20"
                      >
                        Active
                      </Badge>
                    </div>

                    <div className="space-y-3 text-left">
                      <div className="flex items-center text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-foreground">
                          {get(user, "company.name")}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-foreground">{user?.email}</span>
                      </div>
                      {user?.phoneNumber && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-foreground">
                            {user.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Separator />
                <CardFooter className="px-6 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      Account ID
                    </span>
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                        {user?.id}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          navigator.clipboard.writeText(user?.id || "");
                          toast.success("ID copied to clipboard");
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      Member since
                    </span>
                    <span className="text-sm">
                      {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      Last active
                    </span>
                    <span className="text-sm">
                      {user?.lastActivatedAt
                        ? formatDate(
                            user.lastActivatedAt,
                            "MMMM D, YYYY, HH:mm"
                          )
                        : "N/A"}
                    </span>
                  </div>
                </CardFooter>
              </Card>

              {/* Security Status Card */}
              {/* <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="text-sm">Password strength</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Strong
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="text-sm">Last password change</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      30 days ago
                    </span>
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-8">
              <Tabs
                defaultValue="personal"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger
                    value="personal"
                    className="flex items-center gap-2"
                  >
                    <UserCircle2 className="h-4 w-4" />
                    <span>Personal Info</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </TabsTrigger>
                  {/* <TabsTrigger
                    value="activity"
                    className="flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    <span>Activity</span>
                  </TabsTrigger> */}
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal">
                  <PersonalInfo
                    userInfo={user}
                    onSucceed={(userInfo) => {
                      setUser(userInfo);
                      setSaveSuccess(true);
                      // Clear success message after 3 seconds
                      setTimeout(() => {
                        setSaveSuccess(false);
                      }, 3000);
                    }}
                  />
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <KeyRound className="h-5 w-5 text-primary" />
                          Change Password
                        </CardTitle>
                        <CardDescription>
                          Update your password to keep your account secure
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-4"
                        >
                          <motion.div
                            variants={itemVariants}
                            className="space-y-2"
                          >
                            <label
                              htmlFor="currentPassword"
                              className="text-sm font-medium"
                            >
                              Current Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                placeholder="Please enter your current password"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className={`pl-10 ${
                                  passwordErrors.currentPassword
                                    ? "ring-2 ring-destructive"
                                    : ""
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            {passwordErrors.currentPassword && (
                              <p className="text-destructive text-xs flex items-center mt-1">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                {passwordErrors.currentPassword}
                              </p>
                            )}
                          </motion.div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div
                              variants={itemVariants}
                              className="space-y-2"
                            >
                              <label
                                htmlFor="newPassword"
                                className="text-sm font-medium"
                              >
                                New Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="newPassword"
                                  name="newPassword"
                                  placeholder="Your new password"
                                  type={showNewPassword ? "text" : "password"}
                                  value={passwordForm.newPassword}
                                  onChange={handlePasswordChange}
                                  className={`pl-10 ${
                                    passwordErrors.newPassword
                                      ? "ring-2 ring-destructive"
                                      : ""
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              {passwordErrors.newPassword && (
                                <p className="text-destructive text-xs flex items-center mt-1">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  {passwordErrors.newPassword}
                                </p>
                              )}
                            </motion.div>

                            <motion.div
                              variants={itemVariants}
                              className="space-y-2"
                            >
                              <label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium"
                              >
                                Confirm New Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="Retype your new password"
                                  value={passwordForm.confirmPassword}
                                  onChange={handlePasswordChange}
                                  className={`pl-10 ${
                                    passwordErrors.confirmPassword
                                      ? "ring-2 ring-destructive"
                                      : ""
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                                {passwordForm.confirmPassword &&
                                  passwordForm.newPassword ===
                                    passwordForm.confirmPassword && (
                                    <Check className="absolute right-10 top-3 h-4 w-4 text-green-500" />
                                  )}
                              </div>
                              {passwordErrors.confirmPassword && (
                                <p className="text-destructive text-xs flex items-center mt-1">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  {passwordErrors.confirmPassword}
                                </p>
                              )}
                            </motion.div>
                          </div>

                          <motion.div variants={itemVariants} className="pt-2">
                            <Button
                              onClick={handleUpdatePassword}
                              className="gap-2"
                              disabled={saving}
                            >
                              {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                              {saving ? "Updating..." : "Update Password"}
                            </Button>
                          </motion.div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
