import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";



export async function GET(
    {params}:{params:{topicid:string}}
){
    const session=await getServerSession(authOptions);
    if(!session || !session?.user || !session?.user?.id) {
        return Response.json({
            success:false,
            message:"Unauthorized"
        },{status:401})
    }
    try{
        const topicid=params.topicid
        const course=await prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
            where:{topicId:topicid},
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
                        _count: {
                            select: {
                                ownedcourses: true
                            }
                        }
                    }
                },
                topic:true,
                reviews:true,
                courseContent:true

            } 
        })
        if(course){
            return Response.json({
                success:true,
                message:"All course found successfully",
                topicCourses:course
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
