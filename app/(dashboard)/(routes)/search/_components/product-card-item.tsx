"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  Loader2,
  MessageCircle,
  Clock,
  Tags,
  BadgeCheck,
  Share2,
  Eye
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
  const [isHovered, setIsHovered] = useState(false);
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

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title || "Check this product",
        text: product.short_description || "I found this interesting product",
        url: window.location.origin + `/products/${product.id}`,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin + `/products/${product.id}`);
      toast.success("Link copied to clipboard");
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
      <Card 
        className="overflow-hidden w-full max-w-md h-full border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 bg-opacity-90 text-white flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(product.createdAt), {
                addSuffix: true,
              })}
            </span>
            
            {product.tags && product.tags.length > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 bg-opacity-70 text-white flex items-center gap-1">
                <Tags className="h-3 w-3" />
                {product.tags[0]}
                {product.tags.length > 1 && `+${product.tags.length - 1}`}
              </span>
            )}
          </div>
          
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 shadow-sm"
              onClick={onClickSaveProduct}
              disabled={isBookmarkLoading}
            >
              {isBookmarkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <SavedUserIcon
                  className={cn(
                    "w-4 h-4",
                    isSavedByUser ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
                  )}
                />
              )}
            </Button>
          </div>

          <div className="w-full overflow-hidden group">
            <div className="relative w-full aspect-video bg-gray-50">
              {product.imageUrl ? (
                <Image
                  alt={product.title || "Product image"}
                  src={product.imageUrl}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    "object-cover transition-transform duration-500",
                    isHovered && "scale-105"
                  )}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Tags className="w-12 h-12 text-gray-300" />
                </div>
              )}
              
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300",
                isHovered && "opacity-50"
              )} />
            </div>
          </div>
        </div>

        <CardContent className="flex-grow px-5 pt-4 pb-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
              {product.title || "Untitled Product"}
            </h3>
            
            {product.rate && (
              <div className="flex items-center text-lg font-bold text-blue-600 ml-2">
                <span>₹{formattedString(product.rate)}</span>
              </div>
            )}
          </div>

          {product.short_description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {truncate(product.short_description, { length: 120 })}
            </p>
          )}
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-xs text-gray-600">
              <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
              <span>Verified Seller</span>
            </div>
            
            <div className="flex gap-1">
              {product.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-4 pt-0 flex flex-col gap-3 mt-auto">
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button
              variant="outline"
              className="border-green-500 bg-white text-green-600 hover:bg-green-50 flex items-center justify-center gap-1 font-medium text-xs py-2"
              onClick={handleContactClick}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1 font-medium text-xs py-2"
              onClick={handleShareClick}
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>
            
            <Button
              variant="outline"
              className={cn(
                "flex items-center justify-center gap-1 font-medium text-xs py-2",
                isSavedByUser 
                  ? "border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100" 
                  : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
              )}
              onClick={onClickSaveProduct}
            >
              <SavedUserIcon className="w-3.5 h-3.5" />
              {isSavedByUser ? "Saved" : "Save"}
            </Button>
          </div>
          
          {/* <Button
            variant="default"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2"
            onClick={() => router.push(`/search/${product.id}`)}
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button> */}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCardItem;