"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (resetError) {
      setResetError("");
    }
    if (resetMessage) {
      setResetMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = { email: "" };
    let isValid = true;

    if (!formState.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formState.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setResetError("");
    setResetMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setResetMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setResetError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
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
            <div className="text-foreground font-bold text-3xl p-3 rounded-lg">
              Wholesalers beta
            </div>
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
            className="text-card-foreground text-1xl font-bold mb-6 text-start"
          >
            Reset your password
          </motion.h1>

          {resetError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/20 border border-destructive/50 text-destructive-foreground p-3 rounded-md mb-4 flex items-center"
            >
              <AlertCircle className="mr-2 h-5 w-5" />
              {resetError}
            </motion.div>
          )}

          {resetMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border border-green-200 text-green-700 p-3 rounded-md mb-4 flex items-center"
            >
              <Check className="mr-2 h-5 w-5" />
              {resetMessage}
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
                  className={`w-full bg-muted pl-10 text-foreground placeholder:text-muted-foreground py-6 ${
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

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-medium"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="mt-6 text-center text-muted-foreground text-sm"
          >
            <Link href="/login" className="text-primary hover:underline">
              Remembered your password? Sign in
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
