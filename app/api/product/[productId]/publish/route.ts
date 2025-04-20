import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async(
    req: Request,
    {params} : {params : {productId : string}}
) =>{
    try {

        const {userId } = await auth();
        const {productId} = params;

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        if(!productId){
            return new NextResponse("ProductID is missing", {status: 404});
        }

        const product = await db.product.findUnique({
            where: {
                id: productId,
                userId
            }
        })

        if(!product){
            return new NextResponse("Product not found", {status: 404});
        }

        await db.product.update({
            where: {
                id: productId,
            },
            data: {
                isPublished: true,
            }
        })

        return NextResponse.json("Published", {status: 200});
    } catch (error) {
        console.log(`[PRODUCT_PUBLISH_PATCH] : ${error}`);
        return new NextResponse("Internal Server Error", {status: 500});
    }
};