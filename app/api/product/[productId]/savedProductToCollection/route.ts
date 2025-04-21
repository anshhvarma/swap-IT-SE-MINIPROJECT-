import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
    req: Request,
    { params }: { params: { productId: string } }
) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { productId } = params;

        if (!productId) {
            return new NextResponse("Product ID is missing", { status: 400 });
        }

        // Find the job first
        const existingProduct = await db.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return new NextResponse("Product not found", { status: 404 });
        }

        // Update the job by adding the user to savedUsers
        const updatedProduct = await db.product.update({
            where: { id: productId },
            data: {
                savedUsers: {
                    push: userId
                }
            }
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error(`[SAVE_PRODUCT_ERROR]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};