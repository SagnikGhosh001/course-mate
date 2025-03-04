import { getServerSession, User } from "next-auth";
import { authOptions } from "../../users/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { addCourseSChema } from "@/schemas/addCourseSchema";

const validRoles = ['creator', 'admin'];
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user || !session.user.id || !validRoles.includes(session.user.role)) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    try {
        const body = await request.json();
        const { title, description, type, price,topicId } = body;
        if (!title || !description || !type || !price || !topicId) {
            return Response.json({
                success: false,
                message: "Please provide all the fields"
            }, { status: 400 })
        }
        const result = await addCourseSChema.safeParse(body);

        if (!result.success) {
            const addCourseSChemaError = {
                title: result.error.format().title?._errors.join(", ") || "",
                description: result.error.format().description?._errors.join(", ") || "",
                type: result.error.format().type?._errors.join(", ") || "",
                price: result.error.format().price?._errors.join(", ") || "",
            }
            const haserrors = Object.values(addCourseSChemaError).some((x) => x.length > 0)
            return Response.json({
                success: false,
                message: haserrors ? addCourseSChemaError : "please give valid input"
            }, { status: 400 })
        }
        const topic=await prisma.topic.findUnique({where:{id:topicId}})
        if(!topic) {
            return Response.json({
                success: false,
                message: "topic not found"
            }, { status: 404 })
        }
        const owner=await prisma.user.findUnique({where:{id:user.id}})
        if(!owner) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }
        const course = await prisma.course.create({
            data: {
                title,
                description,
                type,
                price,
                topic:{connect:{id:topicId}},
                owner:{connect:{id:user.id}},
            }
        });
        return Response.json({
            success: true,
            message: "course created successfully",
            course:course
        }, { status: 201 })
    } catch (error) {
        console.log(error);

        return Response.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}