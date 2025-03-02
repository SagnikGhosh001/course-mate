import { sendOtpEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/schemas/signUpSchema";
import bcrypt from "bcryptjs";

export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json();
        const { name, email, password, gender } = body;

        if (!name || !email || !password || !gender) {
            return Response.json(
                {
                    success: false,
                    message: "Please fill all fields",
                },
                { status: 400 }
            );
        }

        // validate with zod
        const result = await signUpSchema.safeParse(body);
        if (!result.success) {
            const signUpSchemaError = {
                name: result.error.format().name?._errors.join(", ") || "",
                gender: result.error.format().gender?._errors.join(", ") || "",
                email: result.error.format().email?._errors.join(", ") || "",
                password: result.error.format().password?._errors.join(", ") || "",
            };
            const haserrors = Object.values(signUpSchemaError).some((x) => x.length > 0)
            return Response.json(
                {
                    success: false,
                    message: haserrors ? signUpSchemaError : "please give valid input"
                }
            )
        }

        // check if user already exists with email and is not verified
        const userWithEmailNotVerified = await prisma.user.findFirst({
            where: {
                email,
                isVerified: false
            }
        })
        if (userWithEmailNotVerified) {
            return Response.json({
                success: false,
                message: "This email is already exists but not verified yet"
            }, { status: 400 })
        }
        //check is user already exist with email and verified
        const userWithEmailVerified = await prisma.user.findFirst({
            where: {
                email,
                isVerified: true
            }
        })
        if (userWithEmailVerified) {
            return Response.json({
                success: false,
                message: "THis email is already exist and verified"
            }, { status: 400 })
        }

        // create user
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                gender,
                email,
                verifiedOtp: verifyCode,
                isVerified: false,
                createdAt: new Date(),
                role: "USER",
                verifiedOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
                password: hashedPassword,
            },
        })
        await sendOtpEmail(user.email, user.name, verifyCode);
        return Response.json({
            success: true,
            message: "User Registerd created successfully",
        },{status:200})

    } catch (error) {
        console.log("error for register user", error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}
