"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message, User } from "@/model/User";
import { acceptmessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const { toast } = useToast();

  // State to store messages fetched from the server
  const [messages, setMessages] = useState<Message[]>([]);

  // State to control loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchloading, setIsSwitchLoading] = useState(false);

  // Handle deletion of a message by filtering out the deleted message ID from the state
  const handleDelete = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  // Get session data (e.g., current logged-in user info) from NextAuth
  const { data: session } = useSession();

  // Set up react-hook-form with schema validation
  const form = useForm({
    resolver: zodResolver(acceptmessageSchema), // uses Zod schema for validation
  });
  const { register, watch, setValue } = form;

  // Watching the "acceptMessages" field to track its value for the switch control
  const acceptMessages = watch("acceptMessages");

  // Fetch the current message acceptance setting (on/off) from the server
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get(`/api/accept-message`);
      if (response.data.success)
        setValue("acceptMessages", response.data.isAcceptingMessage);
      else {
        toast({ title: "error", variant: "destructive" });
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error occurred during getting Acceptmessage ",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch all messages, optionally refreshing if `refresh` is true
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsSwitchLoading(true);
      setIsLoading(false);
      try {
        const response = await axios.get(`api/get-messages`);
        if (response.data.success) setMessages(response.data.messages || []);
        else {
          toast({
            title: "Error",
            description: response.data.message,
          });
        }
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages",
            variant: "default",
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Error occurred during getting Messages ",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  // Load messages and acceptMessages status on component mount or when session changes
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // Handle switch control to toggle message acceptance status
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post(`/api/accept-message`, {
        acceptOrRejectMessages: !acceptMessages,
      });
      if (response.data.success) {
        setValue("acceptMessages", !acceptMessages);
        toast({
          title: "Success",
          description: response.data.message,
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error occurred during getting response ",
      });
    }
  };

  // Redirects user to login page if not authenticated
  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  // Get the username from session and create a profile URL
  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  // Copy the profile URL to clipboard
  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Profile URL copied to clipboard",
    });
  };

  return (
    <div className="my-4 md:my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded max-w-6xl">
      <h1 className="text-2xl md:text-4xl font-bold mb-12">User Dashboard</h1>

      {/* Section to display and copy unique profile link */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipBoard}>Copy</Button>
        </div>
      </div>

      {/* Switch to enable or disable accepting messages */}
      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchloading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      {/* Button to refresh messages */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      {/* Display list of messages */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
