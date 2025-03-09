import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"
import { addCourseSChema } from "@/schemas/addCourseSchema";
import { getServerSession } from "next-auth"

const validRoles = ['creator', 'admin'];

export async function PUT(request: Request, { params }: { params: { courseid: string } }) {
    const session = await getServerSession(authOptions)
    const courseid = params.courseid
    if (!session || !session.user || !session.user.id || !validRoles.includes(session.user.role)) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    try {

        
        const body = await request.json();
        const { title, description, type, price, topicId } = body;
        if (!title || !description || !type || !price || !topicId) {
            return Response.json({ success: false, message: "Please provide all the fields" }, { status: 400 })
        }
        const result = await addCourseSChema.safeParse(body);
        if (!result.success) {
            const updateSchemaErrors = {
                title:result.error.format().title?._errors.join(", ") || "",
                description:result.error.format().description?._errors.join(", ") || "",
                type: result.error.format().type?._errors.join(", ") || "",
                price: result.error.format().price?._errors.join(", ") || "",
            }
            const haserrors = Object.values(updateSchemaErrors).some((x) => x.length > 0)
            return Response.json({ success: false, message: haserrors ? updateSchemaErrors : "Validation Error" }, { status: 400 })
        }
        // find course by id and delete it
        const course = await prisma.course.findUnique({ where: { id: courseid } })
        if (!course) {
            return Response.json({ success: false, message: "course not found" }, { status: 404 })
        }
        if (course.ownerId !== session.user.id) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        const updateCourse=await prisma.course.update({
            where: { id: courseid },
            data: {
                title,
                description,
                type,
                price,
                topicId
            }
        })
        return Response.json({ success: true, message: "course deleted successfully",course:updateCourse }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ success: false, message: "something went wrong" }, { status: 500 })
    }
}