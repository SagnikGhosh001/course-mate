import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";



export async function GET(
    req: Request,
    {params}:{params:{courseid:string}}
){
    const session=await getServerSession(authOptions);
    if(!session || !session?.user || !session?.user?.id) {
        return Response.json({
            success:false,
            message:"Unauthorized"
        },{status:401})
    }
    try{
        console.log(params);
        
        if (!params || !params.courseid) {
            console.log("Params or courseid missing");
            return Response.json(
              { success: false, message: "Course ID is required" },
              { status: 400 }
            );
          }
        
        
        const courseid=params.courseid
        const course=await prisma.course.findUnique({
            where:{id:courseid},
            include: {
                _count: {
                    select: {
                        courseContent: true,
                        reviews:true,
                        usercourses:true
                    }
                },
                topic: true,
                owner:{
                    select: {
                        id: true,
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
                reviews:{
                    include:{
                        user:true
                    }
                },
                courseContent:true

            } 
        })
        if(course){
            return Response.json({
                success:true,
                message:"All course found successfully",
                course
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
