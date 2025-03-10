"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { enrollCourses, getAllUserCourse, userCart } from "@/redux/courseslice";

export default function userCartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { status: courseStatus, cart } = useSelector(
    (state: RootState) => state.course
  );
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session) {
      router.push("/user/dashboard");
    }
  }, [session, sessionStatus, router]);


  useEffect(() => {
    dispatch(userCart());
  }, [dispatch]);
  if (sessionStatus === "loading" || courseStatus === "loading") {
    return <div className="text-center p-6">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 animate-fade-in-down">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-300">
            Your Cart
          </h1>
          <Button
            asChild
            className="bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/course/all-course">
              <Plus className="mr-2 h-5 w-5" />
              Add to cart
            </Link>
          </Button>
        </div>
      </header>

      {/* Courses Grid */}
      <main className="max-w-7xl mx-auto">
        {cart.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 animate-fade-in">
            <p className="text-lg">You haven’t added any courses yet.</p>
            <Button
              asChild
              variant="link"
              className="mt-2 text-teal-600 dark:text-teal-400"
            >
              <Link href="/course/all-course">Start by adding a course into cart!</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((course, index) => (
              <Card
                key={course.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {course.course.title}
                  </CardTitle>
                  <Badge
                    className={`${
                      course.course.type === "beginer"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : course.course.type === "intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {course.course.type}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {course.course.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {course.course.topic.title}
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Review: {course.course._count?.reviews} | Enrolled:{" "}
                    {course.course._count?.usercourses} | Content:{" "}
                    {course.course._count?.courseContent}
                  </p>
                </CardContent>
                <CardFooter className="flex-col items-center">
                  <div className="flex justify-between w-full">
                    <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                      {course.course.price}
                      {"$"}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-teal-600 border-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:border-teal-400 dark:hover:bg-teal-900 transition-all duration-200"
                      asChild
                    >
                      <Link href={`/course/${course.course.id}`}>View</Link>
                    </Button>
                  </div>
                  <p>
                    Join At:- {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
