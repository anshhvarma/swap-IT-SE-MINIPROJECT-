'use client'

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface AdminFormProps {
  initialData: {
    adminId: string | null;
  };
  productId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  adminId: z.string().min(1, "Admin is required"),
});

const AdminForm = ({ initialData, productId, options }: AdminFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminId: initialData.adminId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/product/${productId}`, values);
      toast.success("Admin updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong: " + error);
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const selectedOption = options.find(option => option.value === initialData.adminId);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Assigned Admin
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? <>Cancel</> : (<><Pencil className="w-4 h-4 mr-2" />Edit</>)}
        </Button>
      </div>

      {!isEditing && (
        <p className={cn("text-sm mt-2", !initialData.adminId && "text-neutral-500 italic")}>
          {selectedOption?.label || "No Admin Assigned"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="adminId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      heading="Select Admin"
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

export default AdminForm;
