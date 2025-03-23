"use client";

import React, { useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addToCart, getCourseById, joinCourse } from "@/redux/courseslice";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
import { number } from "zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";



function Page() {
    const courseid = useParams<{ courseid: string }>()

    const { data: session, status: sessionStatus } = useSession();
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {

        dispatch(getCourseById(courseid.courseid))
    }, [dispatch,courseid.courseid])
    const router = useRouter()
    const { status, error, course } = useSelector((state: RootState) => state.course)
    const [showMore, setShowMore] = React.useState(false);
    const visibleContent = showMore ? course?.courseContent : course?.courseContent.slice(0, 5);
    const ratings = course?.reviews?.map((review) => review.rating);
    const averageRating = ratings
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    if (status === "loading" || sessionStatus === "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Course not found</h1>
            </div>
        );
    }

    const addCart = async (courseid: string) => {
        const response = await dispatch(addToCart({ courseid })).unwrap()
        toast.success("Course added to your successfully!", {
            description: response.message,
        })
        router.push('/user/cart')

    }
    const buyNow = async (courseid: string) => {
        const response = await dispatch(joinCourse(courseid)).unwrap()
        toast.success("Course joined successfully!", {
            description: response.message,
        })
        router.push('/user/courses')
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sticky Header */}
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>Home</span> &gt; <span>Courses</span> &gt; <span>{course.topic.title}</span>
                    </nav>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {course.title}
                    </h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Course Intro */}
                    <section className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {course.title}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{course.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                {course.topic.title}
                            </Badge>
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-400 text-sm">
                                    {"★".repeat(Math.floor(averageRating)) +
                                        "☆".repeat(5 - Math.floor(averageRating))}
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {course._count.reviews}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    ({course._count.reviews} reviews)
                                </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {course._count.usercourses?.toLocaleString()} students
                            </span>
                        </div>
                    </section>

                    {/* Video Preview Placeholder */}
                    <Card className="mb-6 border-none bg-white dark:bg-gray-800 shadow-sm">
                        <CardContent className="p-4">
                            <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">
                                    [Video Preview Placeholder]
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What You’ll Learn */}
                    <Card className="mb-6 border-none bg-white dark:bg-gray-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                What you’ll learn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                                {course.courseContent.map((objective, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-teal-500">✓</span>
                                        {objective.description}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Course Content */}
                    <Card className="mb-6 border-none bg-white dark:bg-gray-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                Course Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                {course?.courseContent.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        <span>{item.title}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Preview
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {course?._count.courseContent && course?._count?.courseContent > 5 && (
                                <Button
                                    variant="link"
                                    className="mt-4 p-0 text-teal-600 dark:text-teal-400 hover:underline"
                                    onClick={() => setShowMore(!showMore)}
                                >
                                    {showMore ? "Show Less" : `Show ${course.courseContent.length - 5} More`}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    {/* <Card className="mb-6 border-none bg-white dark:bg-gray-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                Requirements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                                {course.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card> */}

                    {/* Instructor */}
                    <Card className="mb-6 border-none bg-white dark:bg-gray-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                Instructor
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={course.owner.avatar} alt={course?.owner.name} />
                                    <AvatarFallback>{course.owner.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                        {course.owner.name}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Instructor • {course?.owner._count.ownedcourses} courses
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews */}
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Student Feedback
                        </h2>
                        <div className="space-y-4">
                            {course?.reviews?.map((review, index) => (
                                <Card
                                    key={index}
                                    className="border-none bg-white dark:bg-gray-800 shadow-sm"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-yellow-400 text-sm">
                                                {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                                            </span>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {review.rating}/5
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            "{review.message}"
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            — {review.owner.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sticky Sidebar */}
                <div className="lg:w-80">
                    <Card className="sticky top-20 border-none bg-white dark:bg-gray-800 shadow-lg">
                        <CardContent className="p-4">
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${course?.price}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                                    ${course?.price}
                                </span>
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    Discount ends in: 2 days (static)
                                </p>
                            </div>
                            <Button
                                size="lg"
                                className="w-full bg-red-600 text-white hover:bg-red-700 mb-2"
                                disabled={course.usercourses?.some((uc) => uc.user.id === session?.user.id)}
                                onClick={() => addCart(course.id)}
                            >

                                Add to Cart
                            </Button>
                            <Button
                                size="lg"
                                className="w-full bg-black text-white hover:bg-gray-800"
                                onClick={() => buyNow(course.id)}
                                disabled={course.usercourses?.some((uc) => uc.user.id === session?.user.id)}
                            >
                                Buy Now
                            </Button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                30-Day Money-Back Guarantee
                            </p>
                            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                                <p className="font-medium">This course includes:</p>
                                <ul className="space-y-1">
                                    <li>✔ {course?._count.courseContent} lectures</li>
                                    <li>✔ Full lifetime access</li>
                                    <li>✔ Access on mobile and TV</li>
                                    <li>✔ Certificate of completion</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Page;