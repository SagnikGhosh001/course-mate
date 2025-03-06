"use client";

import { GraduationCap, Rocket, ShieldCheck, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // shadcn/ui Card
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Master New Skills with CourseMate";
  const [flyTrigger, setFlyTrigger] = useState(false);

  // Typing animation and flying trigger
  useEffect(() => {
    setMounted(true);
    setFlyTrigger(true); // Trigger flying animation on mount

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        index = 0;
        setTypedText("");
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section with Typing Animation */}
      <section className="text-center pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent mb-6 animate-pulse">
            {typedText}
            <span className="animate-blink">|</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
            Transform your learning experience with our curated courses from industry experts.
            Whether you're advancing your career or exploring new hobbies, we've got you covered.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
            >
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
            >
              <Link href="/teach">Become an Instructor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid with Flying Books using Card */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800/40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <Card className="transform hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 border-none">
            <CardHeader>
              <GraduationCap
                className={`h-12 w-12 text-teal-600 ${flyTrigger ? "animate-fly-book" : ""} hover:animate-spin`}
              />
              <CardTitle className="text-2xl font-bold">Expert Instructors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Learn from industry professionals with real-world experience
              </p>
            </CardContent>
          </Card>

          <Card className="transform hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 border-none">
            <CardHeader>
              <LayoutDashboard
                className={`h-12 w-12 text-purple-600 ${flyTrigger ? "animate-fly-book" : ""} hover:animate-spin`}
              />
              <CardTitle className="text-2xl font-bold">Interactive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Engaging courses with quizzes and hands-on projects
              </p>
            </CardContent>
          </Card>

          <Card className="transform hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 border-none">
            <CardHeader>
              <ShieldCheck
                className={`h-12 w-12 text-blue-600 ${flyTrigger ? "animate-fly-book" : ""} hover:animate-spin`}
              />
              <CardTitle className="text-2xl font-bold">Certification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Earn recognized certificates upon completion
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-teal-600 dark:bg-teal-700 text-white transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div className="p-4 hover:scale-110 transition-transform duration-200">
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-gray-200">Active Students</div>
          </div>
          <div className="p-4 hover:scale-110 transition-transform duration-200">
            <div className="text-4xl font-bold mb-2">1.2K+</div>
            <div className="text-gray-200">Courses Available</div>
          </div>
          <div className="p-4 hover:scale-110 transition-transform duration-200">
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-gray-200">Satisfaction Rate</div>
          </div>
          <div className="p-4 hover:scale-110 transition-transform duration-200">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-gray-200">Learning Support</div>
          </div>
        </div>
      </section>

      {/* Course Showcase with Card */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Courses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-none"
              >
                <CardHeader>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 transition-colors duration-300"></div>
                  <CardTitle className="text-xl font-bold">Course Title {item}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                    Brief course description goes here lorem ipsum dolor sit amet.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-teal-600 dark:text-teal-400 font-bold">$99.99</div>
                    <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-700 dark:to-teal-700 text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-bounce">Start Learning Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of students who have transformed their careers with CourseMate
          </p>
          <Button
            size="lg"
            className="text-lg px-10 py-7 bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      

      {/* Back to Top with Flying Rocket */}
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