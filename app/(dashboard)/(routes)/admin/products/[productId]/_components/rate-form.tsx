'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface RateFormProps {
  initialData: {
    rate: string | null;
  };
  productId: string;
}

const formSchema = z.object({
  rate: z
    .string()
    .min(1, { message: "Rate is required" })
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid rate (e.g. 10.99)" }),
});

const RateForm = ({ initialData, productId }: RateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rate: initialData.rate || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/product/${productId}`, values);
      toast.success("Rate updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong: " + error);
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Product Rate
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? <>Cancel</> : (<><Pencil className="w-4 h-4 mr-2" />Edit</>)}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm mt-2">{initialData.rate ? `₹${initialData.rate}` : "Not Provided"}</p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. ₹ 29.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default RateForm;