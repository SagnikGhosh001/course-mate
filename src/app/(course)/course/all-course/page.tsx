"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Star,
  Search,
  Loader,
  TableOfContents,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { getAllCourse } from "@/redux/courseslice";
import Link from "next/link";

function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null); // For positioning and click-outside detection
  const { courses, status } = useSelector((state: RootState) => state.course);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllCourse());
  }, [dispatch]);

  // Update suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      setIsSuggestionOpen(false);
    } else {
      const filteredSuggestions = courses
        .filter((course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((course) => course.title)
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setIsSuggestionOpen(true);
    }
  }, [searchTerm, courses]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSuggestionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = ["All", ...new Set(courses.map((course) => course.topic.title))];
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.topic.title === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setIsSuggestionOpen(false);
  };

  // const handleCourseClick=(courseid:string)=>{
  //   Link
  // }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header Section - Udemy Style */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Courses
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Explore thousands of courses from top instructors
          </p>
        </div>
      </header>

      {/* Search and Filter Section - Udemy Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-1/2" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search for anything"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => suggestions.length > 0 && setIsSuggestionOpen(true)}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-gray-400 focus:border-gray-400 rounded-md text-sm"
            />
            {/* Suggestions Dropdown */}
            {isSuggestionOpen && suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`${selectedCategory === category
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } transition-colors duration-200 text-sm`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid - Udemy Style */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 cursor-pointer">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => {
            const isRightmost = (index + 1) % 4 === 0; // For xl:grid-cols-4
            const modalPosition = isRightmost ? "right-full mr-4" : "left-full ml-4";

            return (

              <div
                key={course.id}
                className="relative"
                onMouseEnter={() => setHoveredCourse(course.id)}
                onMouseLeave={() => setHoveredCourse(null)}
              // onClick={() => handleCourseClick(course)}
              >
                <Link href={`/course/${course.id}`}>
                  <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="p-4">
                      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-t-md" /> {/* Placeholder for course image */}
                      <CardTitle className="mt-2 text-base font-medium text-gray-900 dark:text-white line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {course.owner.name}
                      </p>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{course._count.usercourses}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
                        <span className="ml-1">({course._count.reviews})</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <TableOfContents className="h-3 w-3 mr-1" />
                        <span>{course._count.courseContent}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div>
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          {course.price}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-through ml-2">
                          {course.price}
                        </span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs">
                        {course.topic.title}
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
                {/* Modal on Hover */}
                {hoveredCourse === course.id && (
                  <div
                    className={`absolute top-0 ${modalPosition} w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-md p-4 z-20 animate-fade-in`}
                  >
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {course.description}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        What you will learn:
                      </p>
                      <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400">
                        {course?.courseContent?.map((cc, idx) => (
                          <li key={idx}>{cc.title}: {cc.description}</li>
                        )).slice(0, 5)}
                      </ul>
                    </div>
                    <Button
                      variant="default"
                      className="mt-3 w-full bg-blue-600 text-white hover:bg-blue-700 text-xs"
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Page;