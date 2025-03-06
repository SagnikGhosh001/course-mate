"use client"
// src/app/not-found/page.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <h1 className="text-4xl font-bold ">Oops! Page Not Found</h1>
      <p className="mt-4 text-lg ">
        The page you’re looking for doesn’t exist or you don’t have access.
      </p>
      <Link href="/" className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-4xl hover:bg-blue-600">
        Go Back Home
      </Link>
    </div>
  );
}