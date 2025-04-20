// app/admin/products/[productId]/page.tsx
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  LayoutDashboard,
  ListCheck,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import WhatsappNumberForm from "./_components/whatsapp-number-form";
import ShortDescriptionForm from "./_components/description-form";
import RateForm from "./_components/rate-form";
import CategoryForm from "./_components/category-form";
import TagsForm from "./_components/tags-form";
import AdminForm from "./_components/admin-form";
import ProductPublishAction from "./_components/ProductPublishAction";

const ProductDetailsPage = async ({
  params,
}: {
  params: { productId: string };
}) => {
  // Validate MongoDB ObjectId
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(params.productId)) {
    return redirect("/admin/products");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const product = await db.product.findUnique({
    where: {
      id: params.productId,
      userId,
    },
  });

  if (!product) {
    return redirect("/admin/products");
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const admins = await db.admin.findMany({
    orderBy: { createdAt: "desc" },
  });

  const requiredFields = [
    product.title,
    // product.imageUrl,
    product.categoryId,
    product.rate,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={"/admin/products"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Product Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
        <ProductPublishAction
          productId={params.productId}
          isPublished={product.isPublished}
          disable={!isComplete}
        />
      </div>

      {!product.isPublished && (
        <Banner
          variant={"warning"}
          label="This product is unpublished. It will not be visible in the listings."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left Container */}
        <div>
          <div className="flex items-center gap-x-2 mb-4">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Product Details</h2>
          </div>

          <TitleForm initialData={product} productId={product.id} />
          {/* <ImageForm initialData={product} productId={product.id} /> */}
          <ShortDescriptionForm
            initialData={product}
            productId={product.id}
          />
          
           <WhatsappNumberForm
            initialData={product}
            productId={product.id}
          />
          <RateForm initialData={product} productId={product.id} />
          <CategoryForm
            initialData={product}
            productId={product.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>

        {/* Right Container */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2 mb-2">
              <IconBadge icon={ListCheck} />
              <h2 className="text-xl text-neutral-700">Tags</h2>
            </div>
            <TagsForm initialData={product} productId={product.id} />
          </div>

          <div>
            <div className="flex items-center gap-x-2 mb-2">
              <IconBadge icon={ShoppingCart} />
              <h2 className="text-xl text-neutral-700">Admin Details</h2>
            </div>
            <AdminForm
              initialData={product}
              productId={product.id}
              options={admins.map((admin) => ({
                label: admin.name || "Unknown",
                value: admin.id,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
