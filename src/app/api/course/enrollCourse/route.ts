import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";



export async function GET(
    request: Request,
){
    const session=await getServerSession(authOptions);
    if(!session || !session?.user || !session?.user?.id) {
        return Response.json({
            success:false,
            message:"Unauthorized"
        },{status:401})
    }
    try{    

        const enrollCourse=await prisma.userCourse.findMany({
            where:{userId:session.user.id},
            include:{
                course:{
                    include:{
                        owner:{
                            include:{
                                _count:{
                                    select:{
                                        ownedcourses:true
                                    }
                                }
                            }
                        },
                        reviews:true,
                        topic:true,
                        _count:{
                            select:{
                                courseContent:true,
                                reviews:true,
                                usercourses:true
                            }
                        }
                    }
                    
                }

            },
            orderBy:{createdAt:"desc"}
        })
        if(enrollCourse){
            return Response.json({
                success:true,
                message:"All course found successfully",
                enrollCourse
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
