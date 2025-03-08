"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addCourse } from "@/redux/courseslice"; // New slice
import { getAllTopic } from "@/redux/topicslice"; // Reuse from topics
import { useSession } from "next-auth/react";
import { addCourseSChema } from "@/schemas/addCourseSchema";



export default function AddCoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { status: courseStatus, error: courseError } = useSelector((state: RootState) => state.course);
  const { topics } = useSelector((state: RootState) => state.topic);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // Client-side admin check
  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session || session.user.role !== "creator") {
      router.push("/user/dashboard");
    }
  }, [session, sessionStatus, router]);

  // Fetch topics on mount
  useEffect(() => {
    if (session?.user.role === "creator") {
      dispatch(getAllTopic());
    }
  }, [dispatch, session]);

  const form = useForm<z.infer<typeof addCourseSChema>>({
    resolver: zodResolver(addCourseSChema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      type: "Beginner" as const, 
      topicId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof addCourseSChema>) => {
      const response = await dispatch(addCourse(data)).unwrap();
      toast.success("Course added successfully!", {
        description: response.message,
      });
      form.reset();
  };

  if (sessionStatus === "loading") {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-300 text-center sm:text-left">
          Add New Course
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Course Details
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
                      <FormLabel htmlFor="title" className="text-gray-700 dark:text-gray-300">Title</FormLabel>
                      <FormControl>
                        <Input
                          id="title"
                          placeholder="Enter course title"
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
                      <FormLabel htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="description"
                          placeholder="Enter course description"
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Field */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="price" className="text-gray-700 dark:text-gray-300">Price</FormLabel>
                      <FormControl>
                        <Input
                          id="price"
                          placeholder="Enter price (e.g., 99.99)"
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type Field */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="type" className="text-gray-700 dark:text-gray-300">Type</FormLabel>
                      <FormControl>
                        <select
                        aria-label="Type"
                          id="type"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value as "Beginner" | "Intermediate" | "Expert")}
                          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Topic ID Field */}
                <FormField
                  control={form.control}
                  name="topicId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="topicId" className="text-gray-700 dark:text-gray-300">Topic</FormLabel>
                      <FormControl>
                        <select
                        aria-label="topicId"
                          id="topicId"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Select a topic</option>
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
                  disabled={courseStatus === "loading"}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  {courseStatus === "loading" ? "Adding..." : "Add Course"}
                </Button>
                {courseStatus === "failed" && <p className="text-red-500 text-sm">{courseError}</p>}
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}