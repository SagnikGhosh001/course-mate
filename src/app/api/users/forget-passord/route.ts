import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { passwordValidation } from "@/schemas/userSchema";
import { forgetPasswordConfirmation } from "@/lib/email";

export async function PUT(
    request: NextRequest,
) {
    try {
        const body = await request.json();
        const {email, password,verifycode } = body;
        if (!email ||!password || !verifycode) {
            return Response.json({
                success: false,
                message: "Please provide all the fields"
            }, { status: 400 })
        }
        const result =await passwordValidation.safeParse(password);
        if (!result.success) {
            const emailError = result.error.format()._errors.join(", ");
            return Response.json(
                { success: false, message: emailError || "Invalid password" },
                { status: 400 }
            );
        }
        // Update user
        const updateuser = await prisma.user.findUnique({
            where: {
                email,
            }
        })
        if (!updateuser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        if (!updateuser.verifiedOtp) {
            return Response.json({
              success: false,
              message: "No verification code set for this user",
            }, { status: 400 });
          }
        if(updateuser.verifiedOtp !== verifycode){
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, { status: 400 })
        }
         //check if otp is expired
         if (updateuser.verifiedOtpExpiresAt && new Date(updateuser.verifiedOtpExpiresAt).getTime() < Date.now()) {
            return Response.json({
                success: false,
                message: "OTP expired"
            }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: {
                email
            },
            data: {
                password: hashedPassword,
                verifiedOtp: null,
                verifiedOtpExpiresAt: null
            }
        })
        await forgetPasswordConfirmation(email,password,updateuser.name)
        return Response.json({
            success: true,
            message: "User password updated successfully"
        }, { status: 201 })

    } catch (error) {
        console.log('error to update user', error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}