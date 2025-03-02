import { getServerSession } from "next-auth";
import { authOptions } from "../../../users/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { topicid: string } }
) {

    const session = await getServerSession(authOptions)
    const topicid = params.topicid
    if (!session || !session.user || !session.user.id) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    try {
        // find topic by id
        const topic = await prisma.topic.findUnique({
            where: {
                id: topicid
            }
        })
        if (!topic) {
            return Response.json({
                success: false,
                message: "topic not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "all topic found successfully",
            topic: topic
        }, { status: 200 })

    } catch (error) {
        console.log('error to find topic', error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}