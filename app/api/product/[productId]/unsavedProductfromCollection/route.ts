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

        const existingProduct = await db.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return new NextResponse("Product not found", { status: 404 });
        }

        const updatedSavedUsers = existingProduct.savedUsers.filter(
            (id: string) => id !== userId
        );

        const updatedProduct = await db.product.update({
            where: { id: productId },
            data: {
                savedUsers: updatedSavedUsers
            }
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error(`[UNSAVE_PRODUCT_ERROR]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
