"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmittingForm(true);
    try {
      const result = await signIn("credentials", {
        identifier: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error == "Credentials error")
          toast({
            title: "Login failed",
            description: "Incorrect username or password",
            variant: "destructive",
          });
      }
      toast({
        title: "Logged in",
      });

      if (result?.url) {
        router.replace("/dashboard");
      }
      setIsSubmittingForm(false);
    } catch (error) {
      console.log("error signing-in user", error);
      toast({ title: "signUp failed", variant: "destructive" });
      setIsSubmittingForm(false);
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-6">
              SignIn to Mystrey Message
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Email"
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
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        required
                        placeholder="Password"
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
              <Button type="submit" disabled={isSubmittingForm}>
                {isSubmittingForm ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "SignIn"
                )}
              </Button>
              <p>New to Mystry message? <Link href="/sign-up" className="font-semibold cursor-pointer underline">SignUp</Link></p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
