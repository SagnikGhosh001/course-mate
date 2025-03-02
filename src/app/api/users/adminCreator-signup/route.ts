import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/schemas/signUpSchema";
import bcrypt from "bcryptjs";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendVerificationEmailAdminAndCreator } from "@/lib/email";

export async function POST(request: Request): Promise<Response> {
    const session = await getServerSession(authOptions)
    const adminuser: User = session?.user as User;
    if (!session || !session.user || !session.user.id) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    try {
        const body = await request.json();
        const {role, name, email, password, gender } = body;

        if (!role || !name || !email || !password || !gender) {
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
        //fetch admin first
        const admin = await prisma.user.findUnique({
            where: {
                id: adminuser.id,
                role: "admin"
            }
        })
        if (!admin) {
            return Response.json({
                success: false,
                message: "You are not admin,only admin is allowed for this action"
            }, { status: 401 })
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
                message: "This email is already exist and verified"
            }, { status: 400 })
        }    
        // create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                gender,
                email,
                isVerified: true,
                createdAt: new Date(),
                role,
                password: hashedPassword,
            },
        })
        //send email
        await sendVerificationEmailAdminAndCreator(user.email, user.name,role, password);
        return Response.json({
            success: true,
            message: "User Registerd created successfully",
        }, { status: 200 })

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
