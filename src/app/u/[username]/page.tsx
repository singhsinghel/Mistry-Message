'use client'
import { useCompletion } from "ai/react";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const Page = () => {

  const params = useParams();
  const { toast } = useToast();
  const { username } = params;
  const [suggestions, setSuggestions] = useState([]);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmittingForm(true);
    const content = data.content;
    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content,
      });

      if (response.data.success === true) {
        toast({ title: "Success", description: response.data.message });
      } else {
        toast({
          title: "Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log("error sending message", error);
      toast({ title: "Message sending failed", variant: "destructive" });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const getSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const response = await axios.post(`/api/suggest-messages`);
      const suggestionString = response.data.sendResult;

      // Split the suggestions string and set the array
      const suggestionArray = suggestionString
        .split("||")
        .map((s: string) => s.trim());
      setSuggestions(suggestionArray);
    } catch (error) {
      console.log("Error fetching suggestions", error);
      toast({
        title: "Error",
        description: "Failed to load suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
    const handleSuggestionClick = (message:string) => {
      // Update the input field with the clicked suggestion
      form.setValue("content", message);
    };
  return (
    <>
      <Navbar />
      <div className="py-4 md:py-8 flex flex-col justify-start gap-16 h-screen px-10">
        <h1 className="text-center text-3xl font-bold">Public profile link</h1>

        <div className="send-message md:w-2/3">
          <p>Send Anonymous Message to @{username}</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="gap-4 flex flex-col py-4"
            >
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        required
                        placeholder="Enter your message here"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="md:w-2/5"
                type="submit"
                disabled={isSubmittingForm}
              >
                {isSubmittingForm ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="suggest-message">
          <Button onClick={getSuggestions} disabled={isLoadingSuggestions}>
            {isLoadingSuggestions ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </>
            ) : (
              "Suggest messages"
            )}
          </Button>
          {suggestions.length > 0 && (
            <>
              <p className="mt-2">Click on any message to copy on the input</p>
              <div className="messages border-2 rounded-lg mt-4 flex flex-col gap-5 p-4 container">
                {suggestions.map((message, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg">
                    <p
                      onClick={() => handleSuggestionClick(message)}
                      className="text-lg cursor-pointer"
                    >
                      {message}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
