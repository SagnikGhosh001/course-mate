import { getServerSession, User } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function DELETE({params}:{params:{reviewid:string}}) {
    const session=await getServerSession(authOptions)
    const sessionuser:User=session?.user as User
    if(!session || !session.user || !session.user.id){
        return Response.json({success:false,message:"Unauthorized"},{status:401})
    }
    try{

        const reviewid=params.reviewid
        const review=await prisma.review.findUnique({
            where:{id:reviewid},
            select:{user:{select:{id:true}}}
        })
        if(!review){
            return Response.json({success:false,message:"no review found"},{status:404})
        }
        if(review.user.id!==sessionuser.id){
            return Response.json({success:false,message:"unauthorized"},{status:401})
        }
        const updatedreview=await prisma.review.delete({
            where:{id:reviewid},
        })
        return Response.json({success:true,message:"review deleted successfully",review:updatedreview},{status:201})

    }catch(error){
        console.log(error);
        return Response.json({success:false,message:"Internal server error"},{status:500})
        
    }
}