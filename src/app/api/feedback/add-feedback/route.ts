import { prisma } from "@/lib/prisma";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../users/auth/[...nextauth]/options";
import { addFeedbackSchema } from "@/schemas/addFeedbackSchema";

export async function POST(request:Request) {
    const session=await getServerSession(authOptions)
    const user: User = session?.user as User
    if(!session || !session.user || !session.user.id) {
        return Response.json({success:false,message:"Unauthorized"},{status:401})
    }
    try {
        const body=await request.json();
        const {rating,message}=body
        if(!rating || ! message) {
            return Response.json({success:false,message:"Please provide all the fields"},{status:400})
        }
        const result=await addFeedbackSchema.safeParse({message,rating})
        if(!result.success){
            const addFeedbackSchemaError={
                rating:result.error.format().rating?._errors.join(", ")||"",
                message:result.error.format().message?._errors.join(", ")||"",
            }
            const haserrors=Object.values(addFeedbackSchemaError).some((x)=>x.length>0)
            return Response.json({
                success:false,
                message:haserrors ? addFeedbackSchemaError : "Validation Error",
            },{status:400})
        }

        const feedback=await prisma.feedback.create({
            data:{
                rating,
                message,
                user:{connect:{id:user.id}}
            }
        })
        return Response.json({success:true,message:"Feedback added successfully",feedback},{status:201})
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Internal Server Error"},{status:500})
        
    }
}