
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, {params} : {params : {adminId : string}}) => {
    try {
        const { userId } = await auth();
        const {adminId} = params;

        const updatedValues = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!adminId){
            return new NextResponse("adminId is missing", {status: 401})
        }

        const college = await db.admin.update({
            where:{
                id : adminId,
                userId : userId, 
            },
            data:{
                ...updatedValues,
            }
        })

        return NextResponse.json(college);

    } catch (error) {
        console.log(`[ADMIN_PATCH]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}