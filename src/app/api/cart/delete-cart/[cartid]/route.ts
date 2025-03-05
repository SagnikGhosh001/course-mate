import { getServerSession, User } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/users/auth/[...nextauth]/options";

export async function DELETE({params}:{params:{cartid:string}}) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user || !session.user.id) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    try {
        const cartid = params.cartid; 
        
        const cart = await prisma.cart.findUnique({
            where:{id:cartid},
            include:{
                user:{
                    select:{
                        id:true
                    }
                }
            }
        });
        if(!cart){
            return Response.json({success:false,message:"no cart found"},{status:404});
        }
        if(cart.user.id!==user.id){
            return Response.json({success:false,message:"Unauthorized"},{status:401});
        }
        await prisma.cart.delete({where:{id:cartid}});
        return Response.json({ success: true, message: "cart deleted successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}