/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Loader2,
  Mail,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import useAuthStore from "@/stores/auth";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore.use.login();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };
    let isValid = true;

    if (!formState.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formState.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formState.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const loginData = {
        email: formState.email,
        password: formState.password,
        rememberMe: rememberMe,
      };

      await login(loginData);
      toast.success("Logged in successfully!");
      if (callbackUrl) {
        router.push(decodeURIComponent(callbackUrl));
      } else {
        router.push("/products");
      }
    } catch (error: App.ResponseError) {
      setLoginError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.1,
        }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {/* Replace with your actual logo */}
            <Image
              src="/logo.png"
              alt="Wholepal Logo"
              width={200}
              height={100}
            />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-card rounded-lg p-6 shadow-lg"
        >
          <motion.h1
            variants={itemVariants}
            className="text-foreground text-1xl font-bold mb-6 text-start"
          >
            Sign in to your account
          </motion.h1>

          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/20 border border-destructive/50 text-destructive p-3 rounded-md mb-4 flex items-center"
            >
              <AlertCircle className="mr-2 h-5 w-5" />
              {loginError}
            </motion.div>
          )}

          <motion.form variants={containerVariants} onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className="mb-4">
              <label
                htmlFor="email"
                className="block text-muted-foreground mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formState.email}
                  onChange={handleInputChange}
                  className={`w-full bg-muted border-none pl-10 text-foreground placeholder:text-muted-foreground py-6 ${
                    errors.email ? "ring-2 ring-destructive" : ""
                  }`}
                  disabled={loading}
                />
                {formState.email && !errors.email && (
                  <Check className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-destructive text-sm flex items-center">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label
                htmlFor="password"
                className="block text-muted-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formState.password}
                  onChange={handleInputChange}
                  className={`w-full bg-muted border-none pl-10 text-foreground placeholder:text-muted-foreground py-6 ${
                    errors.password ? "ring-2 ring-destructive" : ""
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-destructive text-sm flex items-center">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-medium"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="mt-6 text-center text-muted-foreground"
          >
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
