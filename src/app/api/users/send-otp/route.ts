import { sendOtpEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { emailValidation } from "@/schemas/userSchema";

export async function PUT(request: Request): Promise<Response> {
    try {
        const body = await request.json();
        const { email } = body;
        if (!email) {
            return Response.json({
                success: false,
                message: "Please fill all fields"
            }, { status: 400 })
        }

        //validate with zod
        const result = await emailValidation.safeParse(email);
        if (!result.success) {
            const emailerror = result.error.format()._errors.join(", ") || []
            return Response.json({
                success: false,
                message: emailerror.length > 0 ? emailerror : "Please give valid input"
            }, { status: 400 })
        }

        const user=await prisma.user.findFirst({
            where:{
                email
            }
        })
        if(!user){
            return Response.json({
                success: false,
                message: "This email is not registered yet"
            }, { status: 400 })
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.user.update({
            where: { id: user.id },
            data:{
                isVerified:false,
                verifiedOtp:verifyCode,
                verifiedOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
            }
        })
        await sendOtpEmail(email, user?.name, verifyCode);
        return Response.json({ 
            success: true,
            message: "OTP sent successfully"
         }, { status: 200 })
    } catch (error) {
        console.error(`Failed to send email:`, error);
        return Response.json({
            success: false,
            message: "Failed to send email"
        }, { status: 500 })
    }
}