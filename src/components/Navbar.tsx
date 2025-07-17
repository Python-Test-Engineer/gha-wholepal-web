"use client";

import { useState } from "react";
import { Activity, Shield, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import useAuthStore from "@/stores/auth";
import { UserTypeEnum } from "@/enums/user";
import Notifications from "./notifications";
import { useRouter } from "next/navigation";

const InviteSupplierDialog = lazyload(
  () => import("@/dialog/invite-supplier-dialog")
);

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const t = useTranslations();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { modal, openModal, closeModal } = useModalState(["inviteSupplier"]);
  const { userInfo: currentUser } = useUser();
  const userType = get(currentUser, "type", UserTypeEnum.SUPPLIER);
  const isSupplier = userType === UserTypeEnum.SUPPLIER;
  const logout = useAuthStore.use.logout();

  const handleLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const getUserInitials = () => {
    try {
      if (!currentUser) return "U";

      if (currentUser.fullName) {
        const names = currentUser.fullName.split(" ");
        if (names.length >= 2) {
          return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return names[0][0].toUpperCase();
      } else if (currentUser.email) {
        return currentUser.email[0].toUpperCase();
      }

      return "U";
    } catch (error) {
      console.error("Error getting user initials:", error);
      return "U";
    }
  };

  return (
    <>
      <nav
        className={`flex items-center justify-between px-4 py-2 bg-card border-b border-border ${className}`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Wholepal Logo" width={170} height={80} />
        </div>

        {/* Right Section - Controls & User */}
        <div className="flex items-center gap-4">
          {/* Invite Supplier Button */}
          {!isSupplier && (
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => openModal("inviteSupplier")}
            >
              {t("invite_supplier")}
            </Button>
          )}

          {/* Notifications Dropdown */}
          <Notifications />

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="User avatar" />
                  <AvatarFallback className="bg-muted-foreground text-background">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.fullName || currentUser?.email || "User"}
                  </p>
                  {currentUser?.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-rose-500 focus:text-rose-500 focus:bg-rose-500/10"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Logout Confirmation Dialog - Placed outside of dropdown menu */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Log Out</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to log out of your account?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {modal.inviteSupplier.load && (
        <InviteSupplierDialog
          open={modal.inviteSupplier.open}
          onClose={closeModal("inviteSupplier")}
        />
      )}
    </>
  );
}
