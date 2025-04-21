"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Card, CardDescription, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  Currency,
  Loader2,
  MessageCircle,
  Calendar,
  Tag,
  Shield,
} from "lucide-react";
import { cn, formattedString } from "@/lib/utils";
import Image from "next/image";
import { truncate } from "lodash";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

interface ProductCardItemProps {
  product: Product;
  userId: string | null;
}

const ProductCardItem = ({ product, userId }: ProductCardItemProps) => {
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const isSavedByUser = userId && product.savedUsers?.includes(userId);
  const SavedUserIcon = isSavedByUser ? BookmarkCheck : Bookmark;
  const router = useRouter();

  const onClickSaveProduct = async () => {
    try {
      setIsBookmarkLoading(true);
      if (isSavedByUser) {
        await axios.patch(`/api/product/${product.id}/unsavedProductfromCollection`);
        toast.success("Removed from collection");
      } else {
        await axios.patch(`/api/product/${product.id}/savedProductToCollection`);
        toast.success("Saved to collection");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Try again.");
      console.error(`Save error: ${(error as Error).message}`);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleContactClick = () => {
    if (product.whatsapp_number) {
      window.open(`https://wa.me/${product.whatsapp_number}`, "_blank");
    } else {
      toast.error("WhatsApp number not available");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="overflow-hidden w-[500px] h-full border border-gray-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
        <div className="relative">
          <CardHeader className="p-3 pb-0 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(product.createdAt), {
                addSuffix: true,
              })}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onClickSaveProduct}
              disabled={isBookmarkLoading}
            >
              {isBookmarkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SavedUserIcon
                  className={cn(
                    "w-4 h-4",
                    isSavedByUser ? "text-blue-600" : "text-gray-400 hover:text-blue-600"
                  )}
                />
              )}
            </Button>
          </CardHeader>

          <div className="w-full flex justify-center p-4 pt-2">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50">
              {product.imageUrl ? (
                <Image
                  alt={product.title || "Product image"}
                  src={product.imageUrl}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-2"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Tag className="w-12 h-12 text-gray-300" />
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="flex-grow px-4 pt-0 pb-3">
          {product.title && (
            <h3 className="font-semibold text-base text-gray-800 mb-1 truncate">
              {product.title}
            </h3>
          )}

          {product.rate && (
            <div className="flex items-center text-base font-bold text-blue-700 mb-2">
              <Currency className="h-4 w-4 mr-1" />
              ₹{formattedString(product.rate)}
            </div>
          )}

          {product.short_description && (
            <CardDescription className="text-xs text-gray-600 mb-3 line-clamp-2">
              {truncate(product.short_description, { length: 100 })}
            </CardDescription>
          )}

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Shield className="h-3 w-3 mr-1 text-green-500" />
            <span>Verified Seller</span>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-2 mt-auto">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              className="border-green-600 bg-white text-green-700 hover:bg-green-50 flex items-center justify-center gap-1 font-medium text-xs py-2"
              onClick={handleContactClick}
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "flex items-center justify-center gap-1 font-medium text-xs py-2",
                isSavedByUser 
                  ? "border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100" 
                  : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
              )}
              onClick={onClickSaveProduct}
            >
              <SavedUserIcon className="w-3 h-3" />
              {isSavedByUser ? "Saved" : "Save"}
            </Button>
          </div>
          
          <Button
            variant="default"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCardItem;