import { getServerSession } from "next-auth";
import { authOptions } from "../../users/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { addTopicSChema } from "@/schemas/addTopicSchema";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id || session.user.role !== "admin") {
        return Response.json({
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

        const topic = await prisma.topic.create({
            data: {
                title,
                description,
                createdAt: new Date(),
            },
        });
        return Response.json({
            success: true,
            message: "Topic added successfully",
            topic: topic,
        },{status: 200})
    } catch (error) {
        console.log('error to add topic', error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}