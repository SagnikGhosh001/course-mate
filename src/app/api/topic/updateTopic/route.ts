import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { addTopicSChema } from "@/schemas/addTopicSchema";

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id || session.user.role !== "admin") {
        return  Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }

    try {
        const body = await request.json();
        const { title, description } = body;
        if (!title || !description) {
            return Response.json({
                success: false,
                message: "Please provide all the fields"
            }, { status: 400 })
        }
        const result = await addTopicSChema.safeParse(body);
        if (!result.success) {
            const addTopicSChemaError = {
                tittle: result.error.format().title?._errors.join(", ") || "",
                description: result.error.format().description?._errors.join(", ") || "",
            };
            const haserrors = Object.values(addTopicSChemaError).some((x) => x.length > 0)
            return Response.json(
                {
                    success: false,
                    message: haserrors ? addTopicSChemaError : "please give valid input"
                }
            )
        }

        const updatetopic = await prisma.topic.findUnique({
            where: {
                id: body.id,
            }
        });
        if (!updatetopic) {
            return Response.json({
                success: false,
                message: "Topic not found"
            }, { status: 404 })
        }

        const newtopic=await prisma.topic.update({
            where: {
              id:updatetopic.id  
            },
            data: {
                title,
                description,
                createdAt: new Date(),
            },
        });
        return Response.json({
            success: true,
            message: "Topic updated successfully",
            topic: newtopic,
        },{status: 200})
    } catch (error) {
        console.log('error to add topic', error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}