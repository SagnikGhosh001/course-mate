import { getServerSession, User } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/users/auth/[...nextauth]/options";

export async function GET({params}:{params:{userid:string}}) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user || !session.user.id) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    try {
        const userid = params.userid; 
        if(userid!==user.id){
            return Response.json({success:false,message:"Unauthorized"},{status:401});
        }
        const cart = await prisma.cart.findMany({
            where:{userId:user.id},
            orderBy: { createdAt: 'desc' },
            include:{
                course:true
            }
        });
        if(cart.length==0){
            return Response.json({ success: false, message: "cart not found" }, { status: 404 });
        }
        return Response.json({ success: true, message: "cart found successfully",cart:cart }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}