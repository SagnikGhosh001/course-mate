import { authOptions } from "@/app/api/users/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request:Request,{params}:{params:{courseid:string}}) {

    const session=await getServerSession(authOptions)
    if(!session ||!session.user || !session.user.id) {
        return Response.json({sucess:false,message:"Unauthorized"},{status:401})
    }
    try {
        const courseid=params.courseid;
        const reviews=await prisma.review.findMany({
            where:{courseId:courseid},
            include:{
                user:{
                    select:{
                        name:true,
                        avatar:true
                    }
                }
            }
        })
        
        if(!reviews) {
            return Response.json({success:false,message:"reviews not found"},{status:404})
        }
        return Response.json({
            success:true,
            message:"review found successfully",
            reviews:reviews
        })
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Internal server error"},{status:500})
        
    }
    
}