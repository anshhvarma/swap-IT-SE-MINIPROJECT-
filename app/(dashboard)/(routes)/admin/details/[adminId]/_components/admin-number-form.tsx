"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Admin } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface AdminMobileFormProps {
  initialData: Admin;
  adminId: string;
}

const formSchema = z.object({
  mobile_number: z
    .string()
    .min(10, { message: "*Mobile number must be 10 digits" })
    .max(10, { message: "*Mobile number must be 10 digits" })
    .regex(/^[0-9]+$/, { message: "*Only digits allowed" }),
});

const AdminMobileForm = ({ initialData, adminId }: AdminMobileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile_number: initialData?.mobile_number || "", // assuming mobile exists in Admin model
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/admin/${adminId}`, values);
      toast.success("Mobile number updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong: " + error);
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Your Mobile Number
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.mobile_number && "text-neutral-500 italic"
          )}
        >
          {initialData.mobile_number || "No mobile number"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            className="space-y-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={isSubmitting}
                      placeholder="Enter 10-digit mobile number"
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

export default AdminMobileForm;
