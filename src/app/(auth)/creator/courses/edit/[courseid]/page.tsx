"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllTopic } from "@/redux/topicslice";
import { getCourseById, updateCourse, addCourseContent } from "@/redux/courseslice";
import { useSession } from "next-auth/react";
import { addCourseSChema } from "@/schemas/addCourseSchema";
import { addCourseContentSchema } from "@/schemas/addCourseContentSchema";



export default function EditCoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { course, status: courseStatus, error: courseError } = useSelector((state: RootState) => state.course);
  const { topics } = useSelector((state: RootState) => state.topic);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseid as string;

  // Course form
  const courseForm = useForm<z.infer<typeof addCourseSChema>>({
    resolver: zodResolver(addCourseSChema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      type: "Beginner" as const,
      topicId: "",
    },
  });

  // Course content form
  const contentForm = useForm<z.infer<typeof addCourseContentSchema>>({
    resolver: zodResolver(addCourseContentSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session || !session.user || !session.user.id) {
      router.push("/sign-in");
    }else if(session.user.role !== "creator") {
      router.push("/user/dashboard");
    }
     else {      
      dispatch(getCourseById(courseId));
      dispatch(getAllTopic());
    }
  }, [session, sessionStatus, dispatch, router, courseId]);

  // Populate course form when course data is fetched
  useEffect(() => {
    if (course && course.id === courseId && session?.user.id === course.owner.id) {
      courseForm.reset({
        title: course.title,
        description: course.description,
        price: course.price,
        type: course.type,
        topicId: course.topic.id,
      });
    } else if (course && session?.user.id !== course.owner.id) {
      router.push("/course"); 
    }
  }, [course, courseId, session, courseForm, router]);

  const onCourseSubmit = async (data: z.infer<typeof addCourseSChema>) => {
    try {
      const response = await dispatch(updateCourse({ courseid:courseId, ...data })).unwrap();
      toast.success("Course updated successfully!", {
        description: response.message,
      });
    } catch (err) {
      toast.error("Failed to update course", {
        description: courseError || "An error occurred",
      });
    }
  };

  const onContentSubmit = async (data: z.infer<typeof addCourseContentSchema>) => {
    try {
      const response = await dispatch(addCourseContent({ courseid:courseId, ...data })).unwrap();
      toast.success("Course content added successfully!", {
        description: response.message,
      });
      contentForm.reset();
      dispatch(getCourseById(courseId)); // Refresh course data
    } catch (err) {
      toast.error("Failed to add content", {
        description: courseError || "An error occurred",
      });
    }
  };

  if (sessionStatus === "loading" || courseStatus === "loading") {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!course || course.id !== courseId) {
    return <div className="text-center p-6">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-6">
      <header className="max-w-7xl mx-auto mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-300 text-center sm:text-left">
          Edit Course
        </h1>
      </header>
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit Course Form */}
        <Card className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Update Course Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...courseForm}>
              <form onSubmit={courseForm.handleSubmit(onCourseSubmit)} className="space-y-6">
                <FormField
                  control={courseForm.control}
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
                <FormField
                  control={courseForm.control}
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
                <FormField
                  control={courseForm.control}
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
                <FormField
                  control={courseForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="type" className="text-gray-700 dark:text-gray-300">Type</FormLabel>
                      <FormControl>
                        <select
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
                <FormField
                  control={courseForm.control}
                  name="topicId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="topicId" className="text-gray-700 dark:text-gray-300">Topic</FormLabel>
                      <FormControl>
                        <select
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
                <Button
                  type="submit"
                  className="w-full bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
                  disabled={courseStatus === "loading" as "idle" | "succeeded" | "failed" | "loading"}
                >
                  Update Course
                </Button>
                {courseStatus === "failed" && <p className="text-red-500 text-sm">{courseError}</p>}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Course Content Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Course Content Form */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Add Course Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...contentForm}>
                <form onSubmit={contentForm.handleSubmit(onContentSubmit)} className="space-y-6">
                  <FormField
                    control={contentForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="content-title" className="text-gray-700 dark:text-gray-300">Content Title</FormLabel>
                        <FormControl>
                          <Input
                            id="content-title"
                            placeholder="Enter content title"
                            className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="content-description" className="text-gray-700 dark:text-gray-300">Content Description</FormLabel>
                        <FormControl>
                          <Textarea
                            id="content-description"
                            placeholder="Enter content description"
                            className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
                    disabled={courseStatus === "loading" as "idle" | "succeeded" | "failed" | "loading"}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Content
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Existing Course Content */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Existing Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.courseContent && course.courseContent.length > 0 ? (
                <ul className="space-y-4">
                  {course.courseContent.map((content, index) => (
                    <li
                      key={content.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 animate-fade-in-up"
                      data-delay={index}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {content.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {content.description}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          // Add delete functionality here if needed
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center">No content available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}