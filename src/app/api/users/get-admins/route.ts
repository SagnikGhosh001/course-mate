import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"; 
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

export async function GET() {

    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id || session.user.role !== "admin") {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    try {
        // find all admins
        const alladmin=await prisma.user.findMany({
            where:{
                role:"admin"
            },
            select:userFields
        })
        return Response.json({
            success:alladmin.length > 0,
            message:alladmin.length>0?"all user found successfully":"no user found",
            creators:alladmin
        },{status: alladmin.length > 0 ? 200 : 404})

    } catch (error) {
        console.log('error to find user', error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}