import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; 
import { prisma } from "@/lib/prisma";

export async function GET(){

    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    try {
        // find all topic
        const alltopic=await prisma.topic.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                parent: true,
                nestedTopics: true, // Include child topics
                courses: true,      // Include related courses
            },
        })
        return Response.json({
            success:alltopic.length > 0,
            message:alltopic.length>0?"all topic found successfully":"no topic found",
            topics:alltopic
        },{status: alltopic.length > 0 ? 200 : 404})
    } catch (error) {
        console.log('error to find topic', error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}
