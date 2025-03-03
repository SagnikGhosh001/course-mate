import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/schemas/updateUserSchema";

export async function PUT(
    request: NextRequest,
    {params}: {params:{userid:string}}
) {

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !session.user || !session.user.id) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    try {
        const userid=params.userid
        if(user.id!==userid){
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }
        const body = await request.json();
        const { name, gender } = body;
        if (!name || !gender) {
            return Response.json({
                success: false,
                message: "Please provide all the fields"
            }, { status: 400 })
        }
        const result = await updateUserSchema.safeParse(body);
        if (!result.success) {
            const updateSchemaErros = {
                name: result.error.format().name?._errors.join(", ") || "",
                gender: result.error.format().gender?._errors.join(", ") || "",
            };
            const haserrors = Object.values(updateSchemaErros).some((x) => x.length > 0)
            return Response.json(
                {
                    success: false,
                    message: haserrors ? updateSchemaErros : "please give valid input"
                }
            )
        }
        // Update user
        const updateuser = await prisma.user.findUnique({
            where: {
                id: userid,
            }
        })
        if (!updateuser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        await prisma.user.update({
            where: {
                id: userid,
            },
            data: {
                name,
                gender
            }
        })
        return Response.json({
            success: true,
            message: "User updated successfully"
        }, { status: 200 })
    } catch (error) {
        console.log('error to update user', error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}