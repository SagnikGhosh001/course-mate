// pages/contact.jsx
"use client";

import { Rocket, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // shadcn/ui Card
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import { Textarea } from "@/components/ui/textarea"; // shadcn/ui Textarea
import { useEffect, useState } from "react";


export default function Contact() {
  const [mounted, setMounted] = useState(false);
  const [flyTrigger, setFlyTrigger] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Trigger flying animation on mount
  useEffect(() => {
    setMounted(true);
    setFlyTrigger(true);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (placeholder)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here (e.g., API call)
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent mb-6 animate-pulse">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
            We’re here to help! Reach out with any questions, feedback, or inquiries.
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800/40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <Card className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-teal-600" />
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  support@coursemate.com
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-teal-600" />
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  +1 (555) 123-4567
                </p>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-teal-600" />
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  123 Learning Lane, Education City, 90210
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="bg-white dark:bg-gray-800 border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    className="w-full"
                    rows={4}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full hover:scale-105 transition-transform duration-200"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-700 dark:to-teal-700 text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-bounce">
            Ready to Learn?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Explore our courses and start your learning journey today!
          </p>
          <Button
            asChild
            size="lg"
            className="text-lg px-10 py-7 bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
          >
            <Link href="/courses">Get Started</Link>
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