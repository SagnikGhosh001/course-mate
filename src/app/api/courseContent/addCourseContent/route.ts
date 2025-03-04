import { getServerSession, User } from "next-auth";
import { authOptions } from "../../users/auth/[...nextauth]/options";
import { addCourseContentSchema } from "@/schemas/addCourseContentSchema";
import { prisma } from "@/lib/prisma";


export async function POST(request:Request) {
    const session=await getServerSession(authOptions);
    const user:User=session?.user as User;
    if(!session || !session.user || !session.user.id || session?.user.role !== "creator") {
        return Response.json({success:false, message:"Unauthorized"}, {status:401});
    }

    try {
        const body=await request.json();
        const {courseid, title,description}=body;
        if(!courseid || !title || !description) {
            return Response.json({success:false, message:"Please provide all the fields"}, {status:400});
        }
        const result=await addCourseContentSchema.safeParse({title,description});
        if(!result.success){
            const addCourseContentSchemaError={
                title:result.error.format().title?._errors.join(", ")|| "",
                description:result.error.format().description?._errors.join(", ")|| "",
            }
            const haserrors=Object.values(addCourseContentSchemaError).some((x)=>x.length>0)
            return Response.json({success:false, message:haserrors ? addCourseContentSchemaError : "Validation Error"}, {status:400});
        }
        const course=await prisma.course.findUnique({
            where:{id:courseid},
        })
        if(!course){
            return Response.json({success:false, message:"course not found"}, {status:404});
        }
        if(course.ownerId !== user.id) {
            return Response.json({success:false, message:"Unauthorized"}, {status:401});
        }
        const courseContent=await prisma.courseContent.create({
            data:{
                title,
                description,
                courseid,
            }
        })
        return Response.json({success:true, message:"Course Content Added Successfully", coursecontent:courseContent}, {status:200});
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Internal Server Error"},{status:500})
        
    }
}