import { authOptions } from "@/app/api/users/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";




export async function GET(request:Request,{params}:{params:{courseid:string}}) {

    const session=await getServerSession(authOptions);

    if(!session||!session.user||!session.user.id) {
        return Response.json({success:false, message:"Unauthorized"}, {status:401});
    }
    try {
        const courseid=params.courseid;
        const courseContent=await prisma.courseContent.findMany({
            where:{courseid},
            orderBy: { createdAt: 'desc' },
            select:{
                createdAt:true,
                description:true,
                id:true,
                title:true,
                updatedAt:true,
                courseid:true,
                course:{
                    select:{
                        title:true,
                        description:true,
                        owner:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            }
        })

        if(!courseContent) {
            return Response.json({success:false, message:"courseContent not found"}, {status:404});
        }
        return Response.json({success:true,message:"Course found successfully", courseContent}, {status:200});
    } catch (error) {
        console.log(error);
        return Response.json({success:false, message:"Internal server error"}, {status:500});
        
    }
}