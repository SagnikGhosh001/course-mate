import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { addReviewSchema } from "@/schemas/addReviewSchema";
import { prisma } from "@/lib/prisma";

export async function POST(request:Request) {
    const session=await getServerSession(authOptions)
    const sessionuser:User=session?.user as User
    if(!session || !session.user || !session.user.id){
        return Response.json({success:false,message:"Unauthorized"},{status:401})
    }
    try{

        const body=await request.json();
        const {courseid,rating,message}=body;
        if(!courseid || !rating || !message){
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

        const course=await prisma.course.findUnique({
            where:{id:courseid}
        })
        if(!course){
            return Response.json({success:false,message:"no course found"},{status:404})
        }

        const user=await prisma.user.findUnique({
            where:{id:sessionuser.id}
        })
        if(!user){
            return Response.json({success:false,message:"no user found"},{status:404})
        }
        const review=await prisma.review.create({
            data:{
                rating,
                message,
                user:{connect:{id:user.id}},
                course:{connect:{id:courseid}}
            }
        })
        return Response.json({success:true,message:"review added successfully",review:review},{status:201})

    }catch(error){
        console.log(error);
        return Response.json({success:false,message:"Internal server error"},{status:500})
        
    }
}