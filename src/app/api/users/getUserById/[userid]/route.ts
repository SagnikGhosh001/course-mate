import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; 
import { prisma } from "@/lib/prisma";

const userFields = {
    id: true,
    name: true,
    avatar: true,
    role: true,
    gender: true,
    email: true,
    createdAt: true,
    updatedAt: true,
    isVerified: true,
  };

export async function GET(
    request: Request,
    { params }: { params: { userid: string } }
) {
    const session = await getServerSession(authOptions)
    const userid=params.userid
    if (!session || !session.user || !session.user.id) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    try {    
        // find user by id
        const user = await prisma.user.findUnique({
            where: {
                id: userid,
            },
            select: userFields
        })
        if (!user) {
            return Response.json({
                success: false, 
                message: "user not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "user found successfully",
            user: user
        }, { status: 200 })

    } catch (error) {    
        console.log('error to find user', error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}