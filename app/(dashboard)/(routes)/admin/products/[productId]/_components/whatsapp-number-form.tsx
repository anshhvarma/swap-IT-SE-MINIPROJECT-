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
import { z } from "zod";

interface WhatsappNumberFormProps {
  initialData: {
    whatsapp_number: string | null;
  };
  productId: string;
}

const formSchema = z.object({
  whatsapp_number: z
    .string()
    .min(10, { message: "Number must be at least 10 digits" })
    .regex(/^[0-9]{10,15}$/, { message: "Enter a valid phone number" }),
});

const WhatsappNumberForm = ({ initialData, productId }: WhatsappNumberFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whatsapp_number: initialData.whatsapp_number || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/product/${productId}`, values);
      toast.success("WhatsApp number updated");
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
        WhatsApp Number
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? <>Cancel</> : (<><Pencil className="w-4 h-4 mr-2" />Edit</>)}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm mt-2">{initialData.whatsapp_number || "Not Provided"}</p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="whatsapp_number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 9876543210"
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

export default WhatsappNumberForm;
