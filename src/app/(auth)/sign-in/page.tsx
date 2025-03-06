// app/sign-in/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signin() {
  const router=useRouter()
  const[isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Placeholder onSubmit (you'll integrate NextAuth signIn here later)
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      setIsSubmitting(false);
  
      if (result?.error) {
        toast.error("Login Failed", {
          description: result.error, 
        });
        return;
      }
  
      if (result?.ok) {
        toast.success("Login Success")
        router.replace("/user/dashboard");

      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setIsSubmitting(false);
      toast.error("Login Failed", {
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br transition-colors duration-300 flex items-center justify-center">
      <Card className="w-full max-w-md border-none dark:border-8 dark:border-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        className="w-full border-gray-300  dark:text-white focus:ring-teal-500 focus:border-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your Password"
                        className="w-full border-gray-300  dark:text-white focus:ring-teal-500 focus:border-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full hover:scale-105 transition-transform duration-200"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            <p>
              Don’t have an account?{" "}
              <Link href="/sign-up" className="text-teal-600 dark:text-teal-400 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}