import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";


export async function GET(){
    const session=await getServerSession(authOptions);
    if(!session || !session?.user || !session?.user?.id) {
        return Response.json({
            success:false,
            message:"Unauthorized"
        },{status:401})
    }
    try{
        const courses=await prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: {
                        courseContent: true,
                        reviews:true,
                        usercourses:true
                    }
                },
                owner:{  
                    select: {
                        name: true,
                        email: true,
                        avatar: true,
                    }
                },
                courseContent: true,
                topic:true
            } 
        })
        if(courses.length>0){
            return Response.json({
                success:true,
                message:"All course found successfully",
                courses
            },{status:200})
        }
        else{
            return Response.json({
                success:false,
                message:"No course found"
            },{status:404})
        }

    }catch(error){
        console.log('error to find course', error);
        return Response.json({
            success:false,
            message:"Internal server error"
        },{status:500})
    }
}
