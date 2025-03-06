import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user || !session.user.id) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await request.json();
        const { courseid } = body;
        if (!courseid) {
            return Response.json({ success: false, message: "please provide all fields" }, { status: 400 });
        }
        const course = await prisma.course.findUnique({
            where: { id: courseid }
        })
        if (!course) {
            return Response.json({ success: false, message: "course not found" }, { status: 404 });
        }
        const cart = await prisma.cart.create({
            data: {
                user: { connect: { id: user.id } },
                course: { connect: { id: courseid } }
            }
        });
        return Response.json({ success: true, message: "Course added to cart successfully", cart: cart }, { status: 201 });

    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}