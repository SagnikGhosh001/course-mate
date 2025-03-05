import { prisma } from "@/lib/prisma";

export async function GET({params}:{params:{feedbackid:string}}) {
    try {
        const feedbackid=params.feedbackid;
        const feedback=await prisma.feedback.findUnique({
            where:{id:feedbackid},
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
        if(!feedback){
            return Response.json({success:false,message:"no feedback found"},{status:404})
        }
        return Response.json({success:true,message:"feedback found successfully",feedback},{status:200})
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Internal Server Error"},{status:500})
        
    }
}