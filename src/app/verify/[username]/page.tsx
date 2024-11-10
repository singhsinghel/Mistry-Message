"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { verifySchema } from "@/schemas/verifySchema";

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

function VerifyOtp() {
  const router = useRouter();
  const params = useParams();
  const username = params.username;

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof verifySchema>) {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username,
        verifyCode: data.code,
      });
      if (response.data.success) {
        toast({
          title: "Welcome to Mystry message",
          description: response.data.message,
        });
        router.replace("/sign-in");
      } else {
        toast({
          title: "Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured",
        description: "Error verifying",
      });
    }
  }

  return (
    <div className="flex w-full h-screen justify-center items-start md:items-center mt-10 md:mt-0 md:bg-gray-100 ">
      <div className="form flex flex-col items-center  rounded-xl p-12 bg-white">
        <h2 className="text-2xl font-bold text-nowrap mb-8">
          Verify your account
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6 flex flex-col justify-start  items-center"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={7} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyOtp;
