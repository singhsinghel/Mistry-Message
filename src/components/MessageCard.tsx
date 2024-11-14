"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCard = ({ message}: MessageCardProps) => {
  console.log(message._id);
  const date = new Date(message.createdAt);

  const { toast } = useToast();

  async function handleDeleteConfirm() {
    try {
      const response = await axios.delete(`/api/delete-message`, {
        data: { messageId: message._id },
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
      } else {
        toast({
          title: "error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);

      toast({
        title: "error",
        description: "Error occured",
        variant: "destructive",
      });
    }
  }
  return (
    <div>
      <Card className="flex justify-between items-center p-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold pb-4 ">
            {message.content}
          </CardTitle>
          <CardDescription>
            {" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            / {date.toLocaleDateString([], { day: "2-digit", month: "short" })}
          </CardDescription>
        </CardHeader>

        {/* for deleting messages */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <X className="x-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                If you will delete this message it will be deleted permanently from your data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteConfirm()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
};

export default MessageCard;
