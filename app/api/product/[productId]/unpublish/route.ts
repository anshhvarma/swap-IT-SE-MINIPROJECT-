import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = await auth();
    const { productId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productId) {
      return new NextResponse("Product ID is missing", { status: 404 });
    }

    const product = await db.product.findUnique({
      where: {
        id: productId,
        userId,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json("Unpublished", { status: 200 });
  } catch (error) {
    console.error(`[PRODUCT_UNPUBLISH_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
