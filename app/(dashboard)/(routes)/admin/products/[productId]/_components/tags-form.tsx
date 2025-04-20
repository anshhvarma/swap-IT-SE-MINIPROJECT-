"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import axios from "axios";
import { Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface TagsFormProps {
  initialData: Product;
  productId: string;
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

const TagsForm = ({ initialData, productId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [productTags, setProductTags] = useState<string[]>(initialData.tags);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/product/${productId}`, values);
      toast.success("Product Updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong: " + error);
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handleTagRemove = (index: number) => {
    const updatedTags = [...productTags];
    updatedTags.splice(index, 1);
    setProductTags(updatedTags);
  };

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !productTags.includes(trimmedValue)) {
      setProductTags([...productTags, trimmedValue]);
      setInputValue("");
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Product Tags
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <> Cancel </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* display the tags if not editing  */}
      {!isEditing && <div className="flex items-center flex-wrap gap-2">
        {initialData.tags.length > 0 ? (
          initialData.tags.map((tag, index) => (
            <div className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100" key={index}>
              {tag}
            </div>
          ))
        ) : (
          <p> No Tags </p>
        )}
      </div>}

      {/* on editing mode display the input  */}
      {isEditing && (
        <>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a tag and press Enter"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={isSubmitting}
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                disabled={!inputValue.trim() || isSubmitting}
              >
                Add
              </Button>
            </div>
            
            <div className="flex items-center flex-wrap gap-2 mt-2">
              {productTags.length > 0 ? (
                productTags.map((tag, index) => (
                  <div 
                    className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100" 
                    key={index}
                  >
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleTagRemove(index)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No tags added yet</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end mt-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setProductTags([]);
                onSubmit({ tags: [] });
              }}
              disabled={isSubmitting}
            >
              Clear All
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                onSubmit({ tags: productTags });
              }}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TagsForm;