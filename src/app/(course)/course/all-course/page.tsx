// app/courses/page.tsx
"use client";

import React, { useState } from "react";
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
} from "lucide-react";

function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);

  // Sample course data with Udemy-like details
  const courses = [
    {
      id: 1,
      title: "Master React in 30 Days",
      instructor: "Jane Doe",
      duration: "6h 30m",
      rating: 4.8,
      reviews: 1245,
      price: "$49.99",
      originalPrice: "$99.99",
      category: "Web Development",
      description: "Learn React from scratch with hands-on projects.",
      topics: ["Components", "Hooks", "State Management", "Routing"],
    },
    {
      id: 2,
      title: "Python for Data Science",
      instructor: "John Smith",
      duration: "8h 15m",
      rating: 4.9,
      reviews: 2389,
      price: "$59.99",
      originalPrice: "$119.99",
      category: "Data Science",
      description: "Master data analysis and visualization with Python.",
      topics: ["Pandas", "NumPy", "Matplotlib", "SciPy"],
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Emily Brown",
      duration: "4h 45m",
      rating: 4.7,
      reviews: 987,
      price: "$39.99",
      originalPrice: "$79.99",
      category: "Design",
      description: "Design user-friendly interfaces with best practices.",
      topics: ["Wireframing", "Prototyping", "User Research", "Figma"],
    },
    {
      id: 4,
      title: "Advanced JavaScript",
      instructor: "Mike Johnson",
      duration: "7h 20m",
      rating: 4.6,
      reviews: 1567,
      price: "$54.99",
      originalPrice: "$109.99",
      category: "Web Development",
      description: "Deep dive into modern JavaScript techniques.",
      topics: ["ES6+", "Async Programming", "Closures", "Modules"],
    },
    {
      id: 5,
      title: "Machine Learning Basics",
      instructor: "Sara Lee",
      duration: "9h 10m",
      rating: 4.85,
      reviews: 2034,
      price: "$69.99",
      originalPrice: "$139.99",
      category: "Data Science",
      description: "Introduction to ML concepts and algorithms.",
      topics: ["Regression", "Classification", "Clustering", "TensorFlow"],
    },
  ];

  const categories = ["All", ...new Set(courses.map((course) => course.category))];
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search for anything"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-gray-400 focus:border-gray-400 rounded-md text-sm"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`${
                  selectedCategory === category
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              >
                <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="p-4">
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-t-md" /> {/* Placeholder for course image */}
                    <CardTitle className="mt-2 text-base font-medium text-gray-900 dark:text-white line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {course.instructor}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <span>{course.rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
                      <span className="ml-1">({course.reviews})</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div>
                      <span className="text-base font-semibold text-gray-900 dark:text-white">
                        {course.price}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 line-through ml-2">
                        {course.originalPrice}
                      </span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs">
                      {course.category}
                    </Badge>
                  </CardFooter>
                </Card>

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
                        {course.topics.slice(0, 3).map((topic, idx) => ( // Limited to 3 for brevity
                          <li key={idx}>{topic}</li>
                        ))}
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