import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"
import { getServerSession, User } from "next-auth"

export async function POST(request:Request,{params}:{params:{courseid:string}}) {

    const session =await getServerSession(authOptions);
    const user:User=session?.user as User;
    if(!session || !session.user || !session.user.id ){
        return Response.json({sucsess:false,message:"Unauthorized"},{status:401});
    }
    const courseid=params.courseid;
    try {
        const course = await prisma.course.findUnique({ where: { id: courseid } });
        if (!course) {
            return Response.json({ success: false, message: "course not found" }, { status: 404 });
        }
        const checkUser = await prisma.user.findUnique({ where: { id:user.id } });
        if (!checkUser) {
            return Response.json({ success: false, message: "user not found" }, { status: 404 });
        }
        const participation = await prisma.userCourse.upsert({
            where: {
              userId_courseId: { // Compound unique index
                userId:user.id,
                courseId:courseid,
              },
            },
            create: {
                userId:user.id,
                courseId:courseid,
            },
            update: {}, // No update needed if already exists
          });
        return Response.json({ success: true, message: "course joined successfully",participation }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "something went wrong" }, { status: 500 });
    }
    
}