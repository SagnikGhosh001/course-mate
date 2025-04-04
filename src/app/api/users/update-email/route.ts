import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailValidation } from "@/schemas/userSchema";

export async function PUT(
    request: NextRequest,
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

        const body = await request.json();
        const { email } = body;
        if (!email) {
            return Response.json({
                success: false,
                message: "Please provide all the fields"
            }, { status: 400 })
        }
        const result =await emailValidation.safeParse(email);
        if (!result.success) {
            const emailError = result.error.format()._errors.join(", ");
            return Response.json(
                { success: false, message: emailError || "Invalid email" },
                { status: 400 }
            );
        }
        // Update user
        const updateuser = await prisma.user.findUnique({
            where: {
                id: user.id,
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
                id: user.id,
            },
            data: {
                email,
                isVerified: false,
                verifiedOtp: null,
                verifiedOtpExpiresAt:null
            }
        })
        return Response.json({
            success: true,
            message: "User email successfully,please verify once again"
        }, { status: 201 })

    } catch (error) {
        console.log('error to update user', error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}