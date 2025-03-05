import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const feedbacks=await prisma.feedback.findMany({
            orderBy:{createdAt:"desc"},

            include:{
                user:{
                    select:{
                        id:true,
                        avatar:true,
                        name:true,
                        gender:true,
                        email:true
                    }
                }
            }
        })
        return Response.json({success:feedbacks.length>0,message:feedbacks.length>0?"all feedback found successfully":"no feedback found",feedbacks},{status:feedbacks.length>0?200:404})
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Internal Server Error"},{status:500})
        
    }
}