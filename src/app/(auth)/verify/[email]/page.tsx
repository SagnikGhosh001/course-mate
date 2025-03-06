// app/verify-account/page.tsx
"use client";

import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { sendOtp, verifyOtp } from "@/redux/authslice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyAccountSchema } from "@/schemas/verifyAccountSchema";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
export default function VerifyAccount() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const [flyTrigger, setFlyTrigger] = useState(false);
  const params = useParams<{ email: string }>();
  const [isResending, setIsResending] = useState(false);
  const decodedEmail = decodeURIComponent(params.email || "");
  const router = useRouter()
  // Initialize react-hook-form with zod
  const form = useForm({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      verifiedOtp: "",
      email: decodedEmail || ""
    },
  });

  useEffect(() => {
    setFlyTrigger(true);
  }, []);

  const onSubmit = async (data: { verifiedOtp: string; email: string }) => {
    try {
      console.log(data.email, data.verifiedOtp);

      const result = await dispatch(verifyOtp(data)).unwrap();
      toast.success("Account verified successfully!", {
        description: result.message,
      });
      router.replace("/sign-in")
    } catch (err) {
      toast.error("Error!", {
        description: err as string,
      });
    }
  };
  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const result = await dispatch(sendOtp(decodedEmail)).unwrap();
      toast.success("Success!", {
        description: result.message,
      });
    } catch (err) {
      toast.success("Error!", {
        description: err as string,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex items-center justify-center">
      <Card className="w-full max-w-md border-none dark:border dark:border-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Verify Your Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Enter the 6-digit OTP sent to your email.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="verifiedOtp"
                render={({ field }) => (
                  <FormItem className=" justify-center">
                    <FormLabel className="sr-only">OTP</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full hover:scale-105 transition-transform duration-200"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Verifying..." : "Verify"}
              </Button>
              {status === "failed" && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="text-teal-600 dark:text-teal-400 hover:underline"
              onClick={handleResendOtp}
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Didn't receive OTP? Click here"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 p-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 hover:scale-110 transition-all duration-200"
        aria-label="Back to top"
      >
        <Rocket className={`h-6 w-6 ${flyTrigger ? "animate-fly-rocket" : ""}`} />
      </Button>
    </div>
  );
}