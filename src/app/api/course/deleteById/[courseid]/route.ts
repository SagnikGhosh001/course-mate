import { authOptions } from "@/app/api/users/auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

const validRoles = ['creator', 'admin'];

export async function DELETE(request: Request, { params }: { params: { courseid: string } }) {
    const session = await getServerSession(authOptions)
    const courseid = params.courseid
    if (!session || !session.user || !session.user.id || !validRoles.includes(session.user.role)) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    try {
        // find course by id and delete it
        const course = await prisma.course.findUnique({ where: { id: courseid } })
        if (!course) {
            return Response.json({ success: false, message: "course not found" }, { status: 404 })
        }
        if(course.ownerId !== session.user.id) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        await prisma.course.delete({ where: { id: courseid } })
        return Response.json({ success: true, message: "course deleted successfully" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ success: false, message: "something went wrong" }, { status: 500 })
    }
}