"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, BookOpen } from "lucide-react";
import { addTopicSChema } from "@/schemas/addTopicSchema";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addTopic, getAllTopic } from "@/redux/topicslice";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function TopicAddPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error, topics } = useSelector((state: RootState) => state.topic);
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (sessionStatus === "loading") return;
        if (!session || session.user.role !== "admin") {
            router.push("/user//dashboard");
        }
    }, [session, sessionStatus, router]);

    useEffect(() => {
        dispatch(getAllTopic());
    }, [dispatch]);
    const form = useForm<z.infer<typeof addTopicSChema>>({
        resolver: zodResolver(addTopicSChema),
        defaultValues: {
            title: "",
            description: "",
            topicId: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof addTopicSChema>) => {
        const response = await dispatch(addTopic(data)).unwrap();
        toast.success("Topic added successfully!", {
            description: response.message,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-6">
            {/* Header */}
            <header className="max-w-7xl mx-auto mb-8 animate-fade-in-down">
                <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-300 text-center sm:text-left">
                    Manage Topics
                </h1>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Topic Form */}
                <Card className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Add New Topic
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Title Field */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 dark:text-gray-300">Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter topic title"
                                                    className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description Field */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 dark:text-gray-300">Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter topic description"
                                                    className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Parent Topic ID Field (Optional) */}
                                <FormField
                                    control={form.control}
                                    name="topicId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 dark:text-gray-300">Parent Topic (Optional)</FormLabel>
                                            <FormControl>
                                                <select
                                                    aria-label="Parent Topic (Optional)"
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value || null)}
                                                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                                >
                                                    <option value="">None</option>
                                                    {topics.map((topic) => (
                                                        <option key={topic.id} value={topic.id}>
                                                            {topic.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    {status === "loading" ? "Adding..." : "Add Topic"}
                                </Button>
                                {status === "failed" && <p className="text-red-500 text-sm">{error}</p>}
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Existing Topics List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Existing Topics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topics.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-400 text-center">No topics available.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {topics.map((topic, index) => (
                                        <li
                                            key={topic.id}
                                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 animate-fade-in-up"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                        {topic.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {topic.description}
                                                    </p>
                                                    {topic.parentId && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Parent: {topics.find((t) => t.id === topic.parentId)?.title || "Unknown"}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex-col space-y-2">
                                                    <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400 hover:animate-bounce" />
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Created: {new Date(topic.createdAt).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Updated: {new Date(topic.updatedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}