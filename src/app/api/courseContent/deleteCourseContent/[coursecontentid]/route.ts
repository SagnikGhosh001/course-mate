import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { getServerSession, User } from "next-auth";



export async function DELETE(request: Request, { params }: { params: { coursecontentid: string } }) {

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !session.user || !session.user.id || session.user.role !== "creator") {
        return Response.json({
            sucess: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    try {
        const coursecontentid = params.coursecontentid;
        if (!coursecontentid) {
            return Response.json({
                sucess: false,
                message: "Please provide coursecontentid"
            }, { status: 400 })
        }
        const coursecontent = await prisma.courseContent.findUnique({
            where: { id: coursecontentid },
            select: {
                course: {
                    select: {
                        ownerId: true
                    }
                }
            }
        })
        if (!coursecontent) {
            return Response.json({
                sucess: false,
                message: "coursecontent not found"
            }, { status: 404 })
        }
        if (coursecontent.course.ownerId !== user.id) {
            return Response.json({
                sucess: false,
                message: "unauhorized"
            }, { status: 401 })
        }
        await prisma.courseContent.delete({
            where: { id: coursecontentid }
        })
        return Response.json({
            sucess: true,
            message: "coursecontent successfully deleted"
        }, { status: 200 })
    } catch (error) {
        console.log(error);
        return Response.json({
            sucess: false,
            message: "Internal server error"
        }, { status: 500 })

    }

}