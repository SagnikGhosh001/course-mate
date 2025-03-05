import { prisma } from "@/lib/prisma";
import { getServerSession, User } from "next-auth";
import { addFeedbackSchema } from "@/schemas/addFeedbackSchema";
import { authOptions } from "@/app/api/users/auth/[...nextauth]/options";

export async function PUT(request:Request,{params}:{params:{feedbackid:string}}) {
    const session=await getServerSession(authOptions)
    const user: User = session?.user as User
    if(!session || !session.user || !session.user.id) {
        return Response.json({success:false,message:"Unauthorized"},{status:401})
    }
    try {
        const feedbackid=params.feedbackid
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
        const updatedfeedback=await prisma.feedback.findUnique({
            where:{
                id:feedbackid
            },
            include:{
                user:{
                    select:{
                        id:true
                    }
                }
            }
        })
        if(!updatedfeedback) {
            return Response.json({success:false,message:"Feedback not found"},{status:404})
        }
        if(updatedfeedback.user.id!==user.id) {
            return Response.json({success:false,message:"unauthorized"},{status:401})
        }
        const feedback=await prisma.feedback.update({
            where:{
                id:feedbackid
            },
            data:{
                rating,
                message,
            }
        })
        return Response.json({success:true,message:"Feedback updated successfully",feedback},{status:200})
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Internal Server Error"},{status:500})
        
    }
}