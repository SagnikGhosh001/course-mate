import { authOptions } from "@/app/api/users/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { addCourseContentSchema } from "@/schemas/addCourseContentSchema";
import { getServerSession, User } from "next-auth";



export async function PUT(request: Request,{params}:{params:{coursecontentid:string}}) {

    const session=await getServerSession(authOptions)
    const user:User=session?.user as User;
    if(!session || !session.user || !session.user.id || session?.user.role !== "creator") {
        return Response.json({success:false, message:"Unauthorized"}, {status:401});
    }

    try{
        const body=await request.json();
        const {title,description}=body;
        const coursecontentid=params.coursecontentid;
        if(!coursecontentid || !title || !description) {
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

        const coursecontent=await prisma.courseContent.findUnique({
            where:{id:coursecontentid},
            select:{
                course:{
                    select:{
                        ownerId:true
                    }
                }
            }
        });
        if(!coursecontent) {
            return Response.json({success:false, message:"coursecontent not found"}, {status:404});
        }
        if(!coursecontent?.course?.ownerId) {
            return Response.json({success:false, message:"Owner not found"}, {status:404});
        }

        if(coursecontent?.course?.ownerId !== user.id) {
            return Response.json({success:false, message:"Unauthorized"}, {status:401});
        }
        const updatedcoursecontent=await prisma.courseContent.update({where:{id:coursecontentid},data:{title,description}});
        return Response.json({success:true, message:"coursecontent updated successfully", coursecontent:updatedcoursecontent}, {status:200});
    }catch(error){
        console.log(error);
        return Response.json({success:false, message:"Internal server error"}, {status:500})
        
    }
    
}