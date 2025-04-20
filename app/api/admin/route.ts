import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const { userId } = await auth();

        const { collegeName } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!collegeName) {
            return new NextResponse("College name is missing", { status: 401 })
        }

        const admin = await db.admin.create({
            data: {
                userId,
                collegeName
            }
        })

        return NextResponse.json(admin);

    } catch (error) {
        console.log(`[ADMIN_POST]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
