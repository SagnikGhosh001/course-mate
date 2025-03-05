import { prisma } from "@/lib/prisma";
import { getServerSession, User } from "next-auth";
import { authOptions } from "@/app/api/users/auth/[...nextauth]/options";

export async function DELETE(request:Request,{params}:{params:{feedbackid:string}}) {
    const session=await getServerSession(authOptions)
    const user: User = session?.user as User
    if(!session || !session.user || !session.user.id) {
        return Response.json({success:false,message:"Unauthorized"},{status:401})
    }
    try {
        const feedbackid=params.feedbackid
        const deletedfeedback=await prisma.feedback.findUnique({
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
        if(!deletedfeedback) {
            return Response.json({success:false,message:"Feedback not found"},{status:404})
        }
        if(deletedfeedback.user.id!==user.id) {
            return Response.json({success:false,message:"unauthorized"},{status:401})
        }
        await prisma.feedback.delete({
            where:{
                id:feedbackid
            },
        })
        return Response.json({success:true,message:"Feedback deleted successfully"},{status:200})
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Internal Server Error"},{status:500})
        
    }
}