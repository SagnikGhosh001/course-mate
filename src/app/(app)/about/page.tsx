"use client";

import { GraduationCap, Rocket, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // shadcn/ui Card
import { useEffect, useState } from "react";

export default function About() {
  const [mounted, setMounted] = useState(false);
  const [flyTrigger, setFlyTrigger] = useState(false);

  // Trigger flying animation on mount
  useEffect(() => {
    setMounted(true);
    setFlyTrigger(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent mb-6 animate-pulse">
            About CourseMate
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
            Empowering learners worldwide with accessible, high-quality education from industry experts.
          </p>
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
          >
            <Link href="/courses">Explore Our Courses</Link>
          </Button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800/40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="transform hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 border-none">
              <CardHeader>
                <GraduationCap
                  className={`h-12 w-12 text-teal-600 ${flyTrigger ? "animate-fly-book" : ""} hover:animate-spin`}
                />
                <CardTitle className="text-2xl font-bold">Quality Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Deliver top-tier courses crafted by experts to help you succeed.
                </p>
              </CardContent>
            </Card>

            <Card className="transform hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 border-none">
              <CardHeader>
                <Users
                  className={`h-12 w-12 text-purple-600 ${flyTrigger ? "animate-fly-book" : ""} hover:animate-spin`}
                />
                <CardTitle className="text-2xl font-bold">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Build a supportive learning community for students and instructors.
                </p>
              </CardContent>
            </Card>

            <Card className="transform hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 border-none">
              <CardHeader>
                <BookOpen
                  className={`h-12 w-12 text-blue-600 ${flyTrigger ? "animate-fly-book" : ""} hover:animate-spin`}
                />
                <CardTitle className="text-2xl font-bold">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Make education available anytime, anywhere, for everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Jane Doe", role: "Founder & CEO" },
              { name: "John Smith", role: "Lead Instructor" },
              { name: "Emily Johnson", role: "Head of Community" },
            ].map((member, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-none"
              >
                <CardHeader>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 transition-colors duration-300 rounded-t-lg"></div>
                  <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {member.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-700 dark:to-teal-700 text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-bounce">
            Join Our Learning Journey
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Become part of a global community dedicated to lifelong learning.
          </p>
          <Button
            size="lg"
            className="text-lg px-10 py-7 bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
          >
            Get Started
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