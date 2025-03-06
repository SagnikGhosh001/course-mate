import {sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { verifyAccountSchema } from "@/schemas/verifyAccountSchema";





export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json();
        const { email, verifiedOtp } = body;
        if (!email || !verifiedOtp) {
            return Response.json({
                success: false,
                message: "Please fill all fields"
            }, { status: 400 })
        }
        //validate with zod
        const result = await verifyAccountSchema.safeParse(body);
        if (!result.success) {
            const verifyAccountSchemaError = {
                email: result.error.format().email?._errors.join(", ") || "",
                verifiedOtp: result.error.format().verifiedOtp?._errors.join(", ") || "",
            }
            const haserrors = Object.values(verifyAccountSchemaError).some((x) => x.length > 0)
            return Response.json({
                success: false,
                message: haserrors ? verifyAccountSchemaError : "Please give valid input"
            }, { status: 400 })
        }
        //check if user already exists with email and verified
        const userWithEmailVerified = await prisma.user.findFirst({
            where: {
                email,
                isVerified: true
            }
        })
        if (userWithEmailVerified) {
            return Response.json({
                success: false,
                message: "This email is already verified"
            }, { status: 400 })
        }
        //check if user already exists with email and not verified 
        const userWithEmailNotVerified = await prisma.user.findFirst({
            where: {
                email,
            }
        })
        //check if email is not registered
        if (!userWithEmailNotVerified) {
            return Response.json({
                success: false,
                message: "This email is not registered yet"
            }, { status: 400 })
        }
        if (!userWithEmailNotVerified.verifiedOtp) {
            return Response.json({
              success: false,
              message: "No verification code set for this user",
            }, { status: 400 });
          }
        
        
        //check if otp is not correct
        if (userWithEmailNotVerified.verifiedOtp !== verifiedOtp) {
            return Response.json({
                success: false,
                message: "Invalid OTP"
            }, { status: 400 })
        }
        //check if otp is expired
        if (userWithEmailNotVerified.verifiedOtpExpiresAt && new Date(userWithEmailNotVerified.verifiedOtpExpiresAt).getTime() < Date.now()) {
            return Response.json({
                success: false,
                message: "OTP expired"
            }, { status: 400 })
        }
        //update user
        await prisma.user.update({
            where: {
                email
            },
            data: {
                isVerified: true,
                verifiedOtp: null,
                verifiedOtpExpiresAt: null
            }
        })
        //send email
        await sendVerificationEmail(email, userWithEmailNotVerified.name);
        return Response.json({
            success: true,
            message: "Account verified successfully"
        }, { status: 201 })


    } catch (error) {
        console.error(`Failed to send email:`, error);
        return Response.json({
            success: false,
            message: "Failed to verify email"
        }, { status: 500 })
    }
}