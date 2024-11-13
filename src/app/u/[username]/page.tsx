"use client";
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
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    },
  });
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmittingForm(true);
    console.log(data);
    const content=data.content
    
    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content
      });

      if (response.data.success == true) {
        toast({ title: "Success", description: response.data.message });
      } else {
        toast({
          title: "Error",
          description: response.data.message,
        });
      }
      setIsSubmittingForm(false);
    } catch (error) {
      console.log("error signing-in user",error);
      toast({ title: "signUp failed", variant: "destructive" });
      setIsSubmittingForm(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="py-4 md:py-8 flex flex-col justify-start gap-16 h-screen items-start md:items-center px-10 md:px-0">
        <h1 className="text-center text-3xl font-bold">Public profile link</h1>
        <div className="send-message md:w-2/3  ">
          <p>Send Anonymous Message to @{username}</p>
          <div>
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
                <Button className="md:w-2/5 " type="submit" disabled={isSubmittingForm}>
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
        </div>
      </div>
    </>
  );
};

export default Page;
