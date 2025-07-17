"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  AlertCircle,
  ChevronDown,
  Clock,
  Bot,
  User,
  Paperclip,
  Mic,
  Smile,
  Info,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  LifeBuoy,
  MessageSquare,
  RotateCw,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { UserTypeEnum } from "@/enums/user";

// Mock conversation data
const generateMockConversation = () => {
  // Sample FAQ options
  const faqOptions = [
    "How do I upload a product?",
    "I need to change product details?",
    "I need to make a new product?",
    "How can I share my product details?",
    "How can I accept a trading partner request?",
    "How can I add more products?",
    "How can I add more users?",
  ];

  // Sample bot responses
  const botResponses = [
    {
      text: "Hello! Welcome to our support chat. How can I help you today?",
      options: faqOptions,
    },
    {
      text: "To track your order, please provide your order number which starts with 'ORD-'. You can find this in your confirmation email.",
    },
    {
      text: "Yes, you can return a product within 30 days of purchase. Would you like me to guide you through the return process?",
      options: ["Yes, please guide me", "No, I'll do it later"],
    },
    {
      text: "Our business hours are Monday to Friday from 9 AM to 6 PM Eastern Time. On weekends, we're available from 10 AM to 4 PM.",
    },
    {
      text: "I understand you'd like to update your shipping address. For security reasons, I'll need to verify your account. Could you please provide your order number and email address associated with the account?",
    },
    {
      text: "Product specifications can be found on each product page under the 'Specifications' tab. Is there a specific product you're inquiring about?",
    },
    {
      text: "I'm connecting you with one of our customer support representatives. They'll be with you shortly.",
      isTransferring: true,
    },
  ];

  return {
    faqOptions,
    botResponses,
  };
};

export default function Support() {
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { userInfo: currentUser } = useUser();
  const userType = get(currentUser, "type", UserTypeEnum.SUPPLIER);
  const isSupplier = userType === UserTypeEnum.SUPPLIER;

  // Mock data
  const { faqOptions, botResponses } = generateMockConversation();

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Start with bot welcome message
        setConversation([
          {
            id: 1,
            sender: "bot",
            message: botResponses[0].text,
            timestamp: new Date().toISOString(),
            options: botResponses[0].options,
          },
        ]);

        setSuggestedPrompts(faqOptions);
      } catch (err) {
        setError("Failed to initialize support chat. Please try again later.");
        console.error("Error initializing chat:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    // Check system preference for dark mode
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  // Send message
  const handleSendMessage = async (text = message) => {
    if (!text.trim()) return;

    // Add user message to conversation
    const userMessageId = conversation.length + 1;
    setConversation((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: "user",
        message: text,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Clear input
    setMessage("");

    // Simulate bot typing
    setIsTyping(true);

    // Focus on input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);

      // Select a random bot response excluding the welcome message
      const randomIndex =
        Math.floor(Math.random() * (botResponses.length - 1)) + 1;
      const botResponse = botResponses[randomIndex];

      setConversation((prev) => [
        ...prev,
        {
          id: userMessageId + 1,
          sender: "bot",
          message: botResponse.text,
          timestamp: new Date().toISOString(),
          options: botResponse.options || [],
          isTransferring: botResponse.isTransferring || false,
        },
      ]);

      // If transferring, simulate agent joining after a delay
      if (botResponse.isTransferring) {
        setTimeout(() => {
          setConversation((prev) => [
            ...prev,
            {
              id: userMessageId + 2,
              sender: "agent",
              agentName: "Alex Thompson",
              message:
                "Hi there! I'm Alex from customer support. I can see you need help. How can I assist you today?",
              timestamp: new Date().toISOString(),
            },
          ]);
        }, 3000);
      }
    }, 1500);
  };

  // Handle suggested prompt click
  const handleSuggestedPromptClick = (prompt) => {
    handleSendMessage(prompt);
    setShowSuggestions(false);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderSuggestedQuestions = (): React.JSX.Element => {
    if (isSupplier) {
      return (
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Suggested Questions
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  showSuggestions ? "transform rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-sm font-normal text-foreground/90 hover:text-foreground bg-muted/50 hover:bg-muted"
                    onClick={() => handleSuggestedPromptClick(prompt)}
                  >
                    <span className="truncate">{prompt}</span>
                    <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return null;
  };

  const renderMessageInput = (): React.JSX.Element => {
    return (
      <div className="p-4 border-t border-border bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="w-full bg-muted border-none px-4 py-3 text-foreground placeholder:text-muted-foreground min-h-[50px] max-h-[120px] resize-none pr-20"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
              >
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
              >
                <Mic className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 w-10 p-0 flex items-center justify-center"
            disabled={!message.trim() || isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    );
  };

  const renderMainChatArea = (): React.JSX.Element => {
    if (isSupplier) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3 bg-card rounded-lg overflow-hidden shadow-lg border border-border flex flex-col h-[calc(100vh-14rem)]"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-muted/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Support Assistant
                </h3>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Info className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <RotateCw className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Maximize2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">
                  Connecting to support...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-foreground mb-2">Connection Error</p>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {conversation.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-t-lg rounded-bl-lg"
                          : msg.sender === "agent"
                          ? "bg-blue-600 text-white rounded-t-lg rounded-br-lg"
                          : "bg-muted text-foreground rounded-t-lg rounded-br-lg"
                      } p-4 shadow-sm`}
                    >
                      {msg.sender === "agent" && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-500">
                          <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
                            <User className="h-3 w-3 text-blue-800" />
                          </div>
                          <span className="text-sm font-medium">
                            {msg.agentName}
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.message}</p>

                      {/* Message Options */}
                      {msg.options && msg.options.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="secondary"
                              className="bg-background text-foreground hover:bg-muted text-sm py-1 h-auto"
                              onClick={() => handleSendMessage(option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Feedback buttons for bot messages */}
                      {msg.sender === "bot" && !msg.isTransferring && (
                        <div className="mt-3 flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-background/50"
                          >
                            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-background/50"
                          >
                            <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      )}

                      {/* Transferring indicator */}
                      {msg.isTransferring && (
                        <div className="mt-3 animate-pulse flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Connecting to support agent...
                          </span>
                        </div>
                      )}

                      <div className="mt-1 text-xs opacity-70 text-right">
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Bot Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted text-foreground rounded-t-lg rounded-br-lg p-3 shadow-sm">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "200ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "400ms" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          {renderMessageInput()}
        </motion.div>
      );
    }

    return null;
  };

  const renderSidebar = (): React.JSX.Element => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isSupplier ? "lg:col-span-1" : "lg:col-span-2"} space-y-6`}
    >
      {/* Suggested Prompts */}
      {renderSuggestedQuestions()}

      {/* Help Resources */}
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-primary" />
          Help Resources
        </h3>
        <ul className="space-y-3">
          <li>
            <a
              href="#"
              className="text-sm text-foreground/80 hover:text-primary flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              User Guide
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-foreground/80 hover:text-primary flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              FAQ
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-foreground/80 hover:text-primary flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Account Settings
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-foreground/80 hover:text-primary flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Contact Support Team
            </a>
          </li>
        </ul>
      </div>

      {/* Support Status */}
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Support Status</h3>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Online
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Average response time: ~2 minutes
        </p>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full"
            style={{ width: "90%" }}
          ></div>
        </div>
        <p className="text-xs text-right mt-1 text-muted-foreground">
          90% availability
        </p>
      </div>
    </motion.div>
  );

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Support Chat
          </h1>
          <p className="text-muted-foreground">
            Get instant help from our support team
          </p>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          {renderMainChatArea()}

          {/* Sidebar */}
          {renderSidebar()}
        </div>
      </div>
    </Layout>
  );
}
