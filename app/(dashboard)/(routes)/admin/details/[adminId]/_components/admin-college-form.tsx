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

interface AdminCollegeNameProps{
  initialData:{
    collegeName: string;
  };
  adminId: string;
}

const formSchema = z.object({
  collegeName: z.string().min(1, {message : "College name is required"},)
});

const AdminCollegeName = ({initialData, adminId} : AdminCollegeNameProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { collegeName: initialData.collegeName },
  })

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/admin/${adminId}`, values)
      toast.success("College Updated")
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong")
      console.log(error)
    }
  }

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        College / Organisation  name
      <Button onClick={toggleEditing} variant={"ghost"}>
        {isEditing ? (
          <> Cancel </>
        ): (
          <>
          <Pencil className="w-4 h-4 mr-2"/>
          Edit
          </>
        )}
      </Button>
      </div>

      {/* display the name if not editing  */}
      {!isEditing && <p className="text-sm mt-2">{initialData.collegeName}</p>}

      {/* on editing mode display the input  */}
      {isEditing && (
      <Form {...form}>
        <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField 
          control={form.control}
          name="collegeName"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                disabled={isSubmitting}
                placeholder="e.g. Harvard, MIT"
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
  )
}

export default AdminCollegeName