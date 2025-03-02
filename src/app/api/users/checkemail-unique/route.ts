import { prisma } from "@/lib/prisma";
import { emailValidation } from "@/schemas/userSchema";



export async function GET(request: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get("email");
        if (!email) {
            return Response.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }
        const result = emailValidation.safeParse(email);
        if (!result.success) {
            const emailError = result.error.format()._errors.join(", ");
            return Response.json(
                { success: false, message: emailError || "Invalid email" },
                { status: 400 }
            );
        }
        // check if email is unique and not verified
        const userWithNotverified = await prisma.user.findUnique({
            where: {
                email,
                isVerified:false
            }
        })
        if (userWithNotverified) {
            return Response.json({
                success: false,
                message: "Email is already taken but not verified"
            }, { status: 400 });
        }
        // check if email is unique and verified
        const userWithverified = await prisma.user.findUnique({
            where: {
                email,
                isVerified:true
            }
        })
        if (userWithverified) {
            return Response.json({
                success: false,
                message: "Email is already taken and verified"
            }, { status: 400 });
        }
        return Response.json({
            success: true,
            message: "Email is available"
        }, { status: 200 });
    } catch (error) {
        console.log("error in checkemail-uique route", error);
        return Response.json({
            success: false,
            message: "Error in checkemail-uique route"
        }, { status: 500 })

    }
}