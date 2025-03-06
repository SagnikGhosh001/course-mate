import { getServerSession, User } from "next-auth";
import { addReviewSchema } from "@/schemas/addReviewSchema";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function PUT(request:Request,{params}:{params:{reviewid:string}}) {
    const session=await getServerSession(authOptions)
    const sessionuser:User=session?.user as User
    if(!session || !session.user || !session.user.id){
        return Response.json({success:false,message:"Unauthorized"},{status:401})
    }
    try{

        const reviewid=params.reviewid
        const body=await request.json();
        const {rating,message}=body;
        if(!reviewid || !rating || !message){
            return Response.json({success:false,message:"please provide all fields"},{status:400})
        }
        const result=await addReviewSchema.safeParse({rating,message})
        if(!result.success){
            const addReviewSchemaError={
                rating:result.error.format().rating?._errors.join(", ")||"",
                message:result.error.format().message?._errors.join(", ")||"",
            }
            const hasErrors=Object.values(addReviewSchemaError).some((x)=>x.length>0)
            return Response.json({success:false,message:hasErrors ? addReviewSchemaError:"validation error"},{status:400})
        }

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
        const updatedreview=await prisma.review.update({
            where:{id:reviewid},
            data:{
                rating,
                message,
            }
        })
        return Response.json({success:true,message:"review updated successfully",review:updatedreview},{status:201})

    }catch(error){
        console.log(error);
        return Response.json({success:false,message:"Internal server error"},{status:500})
        
    }
}