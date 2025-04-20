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
    const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productId) {
      return new NextResponse("productId is missing", { status: 401 });
    }

    const product = await db.product.update({
      where: {
        id: productId,
        userId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`[product_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

//delete the product

export const DELETE = async (
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
      return new NextResponse("productId is missing", { status: 401 });
    }

    const product = await db.product.findUnique({
      where: {
        id: productId,
        userId
      }
    });

    if (!product) {
        return new NextResponse("product Not Found", { status: 404 });
      }

      const deleteproduct = await db.product.delete({
        where: {
          id: productId,
          userId
        },  
      })

      return NextResponse.json(deleteproduct);

  } catch (error) {
    console.log(`[product_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
