// app/user/dashboard/page.tsx
"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ShoppingCart, BookOpen, User, Lock, LogOut, Pencil, Menu, X, UserPlus, PanelTopIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen text-gray-700">Loading...</div>;
  }
  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  const user = session?.user;
  const isCreator = user?.role === "creator";
  const isAdmin = user?.role === "admin";

  // Sidebar items with conditional admin/creator options
  const sidebarItems = [
    { value: "overview", label: "Overview", icon: <User className="h-5 w-5" /> },
    { value: "courses", label: "Courses", icon: <BookOpen className="h-5 w-5" /> },
    ...(isAdmin ? [{ value: "add-creator", label: "Add New Admin or Creator", icon: <UserPlus className="h-5 w-5" /> }] : []),
    ...(isAdmin ? [{ value: "add-topic", label: "Add New Topic", icon: <PanelTopIcon className="h-5 w-5" /> }] : []),
    ...(isCreator ? [{ value: "add-course", label: "Create New Course", icon: <BookOpen className="h-5 w-5" /> }] : []),
    { value: "cart", label: "Cart", icon: <ShoppingCart className="h-5 w-5" /> },
    { value: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { value: "settings", label: "Settings", icon: <Lock className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-teal-700 dark:text-teal-300">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-600 dark:text-teal-400"
            onClick={closeSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.value}
              variant={activeTab === item.value ? "default" : "ghost"}
              className={`w-full justify-start text-left ${
                activeTab === item.value
                  ? "bg-teal-500 text-white hover:bg-teal-600"
                  : "text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900"
              }`}
              onClick={() => {
                setActiveTab(item.value);
                setIsSidebarOpen(false);
              }}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Toggle Icon */}
        <header className="bg-blue-500 dark:bg-gray-700 text-white p-4 shadow-md animate-fade-in-down">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-blue-600 dark:text-gray-100 dark:hover:bg-gray-600"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">CourseMate Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap justify-center">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                <AvatarFallback className="bg-teal-200 text-teal-800">{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">{user?.name}</span>
              <Badge
                variant={isAdmin || isCreator ? "default" : "secondary"}
                className={
                  isAdmin
                    ? "bg-blue-100 text-blue-800 animate-pulse"
                    : isCreator
                    ? "bg-teal-100 text-teal-800 animate-pulse"
                    : "bg-gray-200 text-gray-800"
                }
              >
                {isAdmin ? "Admin" : isCreator ? "Creator" : "Learner"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="text-black border-white hover:bg-red-800 hover:text-white dark:hover:bg-red-800 dark:bg-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800 animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-teal-700 dark:text-teal-300 text-lg sm:text-xl">
                    Welcome, {user?.name}!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {isAdmin
                      ? "Manage creators and oversee the platform here."
                      : isCreator
                      ? "Manage your courses and earnings here."
                      : "Explore courses, manage your cart, and update your profile!"}
                  </p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 gap-6">
                <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800 animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center text-teal-700 dark:text-teal-300 text-base sm:text-lg">
                      <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />{" "}
                      {isAdmin ? "All Courses" : isCreator ? "Your Courses" : "Enrolled Courses"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      {isAdmin
                        ? "View all courses on the platform."
                        : isCreator
                        ? "Create or edit your courses."
                        : "View your enrolled courses."}
                    </p>
                    <Button
                      variant="link"
                      asChild
                      className="mt-2 p-0 text-teal-600 dark:text-teal-400 text-sm sm:text-base"
                    >
                      <Link href={isAdmin ? "/admin/courses" : isCreator ? "/creator/courses" : "/user/courses"}>
                        Go to Courses
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                {!isAdmin && (
                  <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800 animate-slide-up">
                    <CardHeader>
                      <CardTitle className="flex items-center text-teal-700 dark:text-teal-300 text-base sm:text-lg">
                        <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Cart
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Check your cart items.</p>
                      <Button
                        variant="link"
                        asChild
                        className="mt-2 p-0 text-teal-600 dark:text-teal-400 text-sm sm:text-base"
                      >
                        <Link href="/user/cart">View Cart</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-teal-700 dark:text-teal-300 text-base sm:text-lg">
                    {isAdmin ? "All Courses" : isCreator ? "Your Courses" : "Your Courses"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAdmin ? (
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      List of all courses on the platform will appear here.
                    </p>
                  ) : isCreator ? (
                    <div className="space-y-4">
                      <Button
                        asChild
                        className="bg-teal-500 text-white hover:bg-teal-600 text-sm sm:text-base w-full sm:w-auto"
                      >
                        <Link href="/creator/courses/new">Create New Course</Link>
                      </Button>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        List of your courses will appear here.
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      Your enrolled courses will be listed here.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Add New Creator Tab (Admin Only) */}
            {isAdmin && (
              <TabsContent value="add-creator">
                <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-teal-700 dark:text-teal-300 text-base sm:text-lg">
                      Add New Admin or Creator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 space-x-4 text-center">
                      <Button
                        asChild
                        className="bg-teal-500 text-white hover:bg-teal-600 text-xs px-3 py-1 w-full sm:w-auto"
                      >
                        <Link href="/admin/new">Add Admin</Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-teal-500 text-white hover:bg-teal-600 text-xs px-3 py-1 w-full sm:w-auto"
                      >
                        <Link href="/admin/creator/new">Add Creator</Link>
                      </Button>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        Manage the list of creators here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            {isAdmin && (
              <TabsContent value="add-topic">
                <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-teal-700 dark:text-teal-300 text-base sm:text-lg">
                      Add New Topic
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        asChild
                        className="bg-teal-500 text-white hover:bg-teal-600 text-xs px-3 py-1 w-full sm:w-auto"
                      >
                        <Link href="/topic/new">Add New Topic</Link>
                      </Button>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        Manage the list of topics here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Add New Course Tab (Creator Only) */}
            {isCreator && (
              <TabsContent value="add-course">
                <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-teal-700 dark:text-teal-300 text-base sm:text-lg">
                      Create New Course
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        asChild
                        className="bg-teal-500 text-white hover:bg-teal-600 text-sm sm:text-base w-full sm:w-auto"
                      >
                        <Link href="/creator/courses/new">Create Course</Link>
                      </Button>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        Start creating a new course here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Cart Tab (Learner/Creator Only) */}
            <TabsContent value="cart">
              <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-teal-700 dark:text-teal-300 text-base sm:text-lg">Shopping Cart</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Your cart items will be displayed here.</p>
                  <Button
                    variant="outline"
                    className="mt-4 border-teal-500 text-teal-500 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900 text-sm sm:text-base w-full sm:w-auto"
                    onClick={() => toast.info("Checkout coming soon!")}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-teal-700 dark:text-teal-300 text-base sm:text-lg">
                    <User className="mr-2 h-4 sm:h-5" /> Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                        <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                        <AvatarFallback className="bg-teal-100 text-teal-800">{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{user?.name}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{user?.email}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Gender: {user?.gender}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      asChild
                      className="border-teal-500 text-teal-500 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Link href="/user/profile/edit">
                        <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="border border-gray-200 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-teal-700 dark:text-teal-300 text-base sm:text-lg">
                    <Lock className="mr-2 h-4 sm:h-5 w-5" /> Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <Button
                      variant="outline"
                      asChild
                      className="border-teal-500 text-teal-500 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Link href="/user/settings/update-email">Update Email</Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="border-teal-500 text-teal-500 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Link href="/user/settings/change-password">Change Password</Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="border-teal-500 text-teal-500 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Link href="/user/settings/forgot-password">Forgot Password</Link>
                    </Button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    More settings options can be added here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Overlay for sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-40" onClick={closeSidebar} />
      )}
    </div>
  );
}