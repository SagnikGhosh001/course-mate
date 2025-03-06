"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // Add these
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toogle"; 

interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Feedback", href: "/feedback" },
  { title: "Contact", href: "/contact" },
];

export function Navbar() {
  
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const authNavItems = session
    ? [{ title: "Dashboard", href: "/dashboard" }, { title: "Logout", href: "#" }]
    : [{ title: "Sign in", href: "/sign-in" }];

  return (
    <header className="sticky top-0 p-2 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="flex items-center gap-2 font-bold" onClick={() => setIsOpen(false)}>
                  <span className="text-xl">Course-Mate</span>
                </Link>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm font-medium ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                  {authNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm font-medium ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}
                      onClick={() => {
                        if (item.title === "Logout") signOut();
                        setIsOpen(false);
                      }}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="hidden text-xl sm:inline-block">Course-Mate</span>
          </Link>
        </div>
        <nav className="hidden gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}
            >
              {item.title}
            </Link>
          ))}
          {authNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => item.title === "Logout" && signOut()}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {status === "loading" ? (
            <Button disabled>Loading...</Button>
          ) : session ? (
            <Button onClick={() => signOut()}>Sign Out</Button>
          ) : (
            <Button asChild className="hidden sm:flex">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}