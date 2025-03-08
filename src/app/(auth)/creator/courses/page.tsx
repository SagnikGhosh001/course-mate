// app/creator/courses/page.tsx
"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getAllUserCourse } from "@/redux/courseslice";

export default function CreatorCoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { status: courseStatus,userCourses } = useSelector((state: RootState) => state.course);
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
        dispatch(getAllUserCourse());
      }
    }, [dispatch, session]);
    if (sessionStatus === "loading" || courseStatus === "loading") {
      return <div className="text-center p-6">Loading...</div>;
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 animate-fade-in-down">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-300">
            Your Courses
          </h1>
          <Button
            asChild
            className="bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/creator/courses/new">
              <Plus className="mr-2 h-5 w-5" />
              Add New Course
            </Link>
          </Button>
        </div>
      </header>

      {/* Courses Grid */}
      <main className="max-w-7xl mx-auto">
        {userCourses.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 animate-fade-in">
            <p className="text-lg">You haven’t created any courses yet.</p>
            <Button
              asChild
              variant="link"
              className="mt-2 text-teal-600 dark:text-teal-400"
            >
              <Link href="/creator/courses/new">Start by adding a course!</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCourses.map((course, index) => (
              <Card
                key={course.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {course.title}
                  </CardTitle>
                  <Badge
                    className={`${
                      course.type === "beginer"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : course.type === "intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {course.type}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {course.topic.title}
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Review: {course._count?.reviews} | Enrolled: {course._count?.usercourses} | Content: {course._count?.courseContent}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                    {course.price}{"$"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-teal-600 border-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:border-teal-400 dark:hover:bg-teal-900 transition-all duration-200"
                    asChild
                  >
                    <Link href={`/creator/courses/edit/${course.id}`}>Edit</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}