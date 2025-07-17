"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Package,
  Package2,
  LifeBuoy,
  LogOut,
  Boxes,
  FileSearch,
  FileSpreadsheet,
  Download,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserTypeEnum } from "@/enums/user";
import useAuthStore from "@/stores/auth";

export function Sidebar() {
  const [expanded, setExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarExpanded");
      return savedState !== null ? savedState === "true" : false;
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname();
  const [companyName, setCompanyName] = useState("");
  const { userInfo: currentUser } = useUser();
  const userType = get(currentUser, "type", UserTypeEnum.SUPPLIER);
  const isSupplier = userType === UserTypeEnum.SUPPLIER;
  const logout = useAuthStore.use.logout();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && expanded) {
        setExpanded(false);
        localStorage.setItem("sidebarExpanded", "false");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded]);

  useEffect(() => {
    if (isClient) {
      if (currentUser) {
        const companyName = get(currentUser, "company.name", "Wholepal");
        setCompanyName(companyName);
      }
    }
  }, [isClient]);

  const renderBetaTag = (): React.JSX.Element => (
    <span className="px-1 py-0.5 text-blue-600 bg-blue-100 border border-blue-600 rounded-md uppercase text-xs">
      beta
    </span>
  );

  const navItems = isSupplier
    ? [
        { name: "My Products", icon: <Package size={20} />, href: "/products" },
        {
          name: "Documents",
          icon: <FileSearch size={20} />,
          href: "/documents",
        },
        {
          name: (
            <div className="flex items-center gap-2">
              NLF Templates {renderBetaTag()}
            </div>
          ),
          icon: <FileSpreadsheet size={20} />,
          href: "/nlf-templates",
        },
        {
          name: (
            <div className="flex items-center gap-2">
              Download {renderBetaTag()}
            </div>
          ),
          icon: <Download size={20} />,
          href: "/downloads",
        },
        { name: "Support", icon: <LifeBuoy size={20} />, href: "/faqs" },
      ]
    : [
        { name: "My Products", icon: <Package size={20} />, href: "/products" },
        {
          name: "Supplier Products",
          icon: <Package2 size={20} />,
          href: "/supplier-products",
        },
        {
          name: "Shared Documents",
          icon: <FileSearch size={20} />,
          href: "/documents",
        },
        { name: "Support", icon: <LifeBuoy size={20} />, href: "/faqs" },
      ];

  const profileItem = {
    name: "Profile",
    icon: <User size={20} />,
    href: "/profile",
  };

  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowLogoutDialog(true);
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const sidebarVariants = {
    expanded: { width: "240px", transition: { duration: 0.3 } },
    collapsed: { width: "72px", transition: { duration: 0.3 } },
  };

  const textVariants = {
    expanded: {
      opacity: 1,
      display: "block",
      transition: { delay: 0.1, duration: 0.2 },
    },
    collapsed: { opacity: 0, display: "none", transition: { duration: 0.2 } },
  };

  const logoTextVariants = {
    expanded: {
      opacity: 1,
      width: "auto",
      transition: { delay: 0.1, duration: 0.2 },
    },
    collapsed: { opacity: 0, width: 0, transition: { duration: 0.2 } },
  };

  const toggleSidebar = () => {
    const newState = !expanded;
    setExpanded(newState);
    localStorage.setItem("sidebarExpanded", newState.toString());
  };

  return (
    <>
      <motion.aside
        initial={isClient ? (expanded ? "expanded" : "collapsed") : false}
        animate={isClient ? (expanded ? "expanded" : "collapsed") : false}
        variants={sidebarVariants}
        style={{
          width: !isClient ? (expanded ? "240px" : "72px") : undefined,
          minWidth: expanded ? 240 : 72,
        }}
        className="h-screen bg-card border-r border-border shadow-sm z-10 sticky top-0 flex flex-col overflow-hidden"
      >
        {/* Logo and Brand */}
        <div className="flex items-center h-16 px-4 border-b border-border">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary">
              <Boxes size={20} />
            </div>
            <motion.div
              variants={logoTextVariants}
              className="ml-3 font-semibold text-foreground overflow-hidden truncate max-w-[160px]"
            >
              {companyName}
            </motion.div>
          </div>

          <motion.button
            className="ml-auto p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
            onClick={toggleSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            style={{
              position: expanded ? "relative" : "absolute",
              right: expanded ? "auto" : "0",
              transform: expanded ? "none" : "translateX(50%)",
            }}
          >
            <ChevronLeft
              size={18}
              style={{
                transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </motion.button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto hide-scrollbar">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link href={item.href} passHref>
                    <motion.div
                      className={`flex items-center px-3 py-2.5 rounded-md cursor-pointer transition-colors
                        ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.1 },
                      }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <motion.span
                        variants={textVariants}
                        className="whitespace-nowrap ml-3 font-medium text-sm"
                      >
                        {item.name}
                      </motion.span>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className={`${
                            expanded ? "ml-auto" : "absolute left-0"
                          } w-1 h-7 bg-primary rounded-full`}
                          layoutId={
                            expanded
                              ? "activeIndicator"
                              : "activeIndicatorSmall"
                          }
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Secondary Navigation (Bottom) */}
        <div className="p-3 border-t border-border mt-auto flex-shrink-0">
          <ul className="space-y-1.5">
            {/* Profile Item */}
            <li key={profileItem.name}>
              <Link href={profileItem.href} passHref>
                <motion.div
                  className={`flex items-center px-3 py-2.5 rounded-md cursor-pointer transition-colors
                    ${
                      pathname === profileItem.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  whileHover={{
                    scale: 1.01,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    {profileItem.icon}
                  </div>
                  <motion.span
                    variants={textVariants}
                    className="whitespace-nowrap ml-3 font-medium text-sm"
                  >
                    {profileItem.name}
                  </motion.span>

                  {/* Active indicator */}
                  {pathname === profileItem.href && (
                    <motion.div
                      className={`${
                        expanded ? "ml-auto" : "absolute left-0"
                      } w-1 h-7 bg-primary rounded-full`}
                      layoutId={
                        expanded
                          ? "activeIndicatorSecondary"
                          : "activeIndicatorSecondarySmall"
                      }
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.div>
              </Link>
            </li>

            {/* Logout Item - Modified to use onClick handler */}
            <li key="logout">
              <a href="#" onClick={handleLogoutClick}>
                <motion.div
                  className="flex items-center px-3 py-2.5 rounded-md cursor-pointer transition-colors
                    text-muted-foreground hover:bg-muted hover:text-foreground"
                  whileHover={{
                    scale: 1.01,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <motion.span
                    variants={textVariants}
                    className="whitespace-nowrap ml-3 font-medium text-sm"
                  >
                    Logout
                  </motion.span>
                </motion.div>
              </a>
            </li>
          </ul>
        </div>
      </motion.aside>

      {/* Logout Confirmation Dialog */}
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
    </>
  );
}
