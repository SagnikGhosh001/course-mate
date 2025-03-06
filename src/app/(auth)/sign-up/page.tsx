// app/signup/page.tsx
"use client";

import { Rocket } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { emailUnique, submitSignupForm } from "@/redux/authslice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";



export default function Signup() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.auth);
    const [flyTrigger, setFlyTrigger] = useState(false);
    const [emailMessage, setEmailMessage] = useState("");
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    // Initialize react-hook-form with zod
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            gender: "male",
        },
    });

    // Debounce email check with 500ms delay
    const debouncedEmailCheck = useDebounceCallback(async (emailValue) => {
        if (emailValue) {
            setIsCheckingEmail(true);
            setEmailMessage("");
            try {
                const response = await dispatch(emailUnique(emailValue)).unwrap();
                setEmailMessage(response.message);
            } catch (error) {
                setEmailMessage((error as string) || "Error checking email");
            } finally {
                setIsCheckingEmail(false);
            }
        } else {
            setEmailMessage("");
            setIsCheckingEmail(false);
        }
    }, 500);

    useEffect(() => {
        setFlyTrigger(true);
    }, []);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        const result = await dispatch(submitSignupForm(data)).unwrap();
        toast.success("Account created successfully!", {
            description: result.message,
        });
        router.push(`/verify/${data.email}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br transition-colors duration-300">
            <section className="text-center pt-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent mb-6 animate-pulse">
                        Sign Up
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
                        Join CourseMate to start your learning journey!
                    </p>
                </div>
            </section>

            <section className="px-4 transition-colors duration-300 ">
                <div className="max-w-md mx-auto">
                    <Card className="border-none dark:border-8 dark:border-white">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="Your Email"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e); // Update form state
                                                            debouncedEmailCheck(e.target.value); // Trigger debounced check
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {isCheckingEmail && <p className="text-gray-500 text-sm">Checking email...</p>}
                                                {emailMessage && !isCheckingEmail && (
                                                    <p
                                                        className={
                                                            emailMessage.includes("error") ? "text-red-500 text-sm" : "text-green-500 text-sm"
                                                        }
                                                    >
                                                        {emailMessage}
                                                    </p>
                                                )}
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Your Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <FormControl>
                                                    <select
                                                        {...field}
                                                        className="w-full p-2 border rounded dark:bg-black  dark:text-white"
                                                    >
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full hover:scale-105 transition-transform duration-200"
                                        disabled={status === "loading" || isCheckingEmail}
                                    >
                                        {status === "loading" ? "Signing Up..." : "Sign Up"}
                                    </Button>
                                    {status === "failed" && <p className="text-red-500 text-sm">{error}</p>}
                                </form>
                            </Form>
                            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                                <p>Verify your account on <b> verify/youremail@gmail.com</b> before logging in.</p>
                                <p>
                                    Already have an account?{" "}
                                    <Link href="/sign-in" className="text-teal-600 dark:text-teal-400 hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </CardContent>

                    </Card>

                </div>
            </section>

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