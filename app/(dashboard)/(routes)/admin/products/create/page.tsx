'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ArrowLeft, Package } from "lucide-react"

// Schema to validate product title
const formSchema = z.object({
  title: z.string().min(1, { message: "Product Name cannot be empty" }).max(50),
})

const ProductCreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/product', values);
      router.push(`/admin/products/${response.data.id}`);
      toast.success("Product created successfully");
    } catch (error) {
      console.error((error as Error).message);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-2">
          <Package className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600 mr-2 flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">Create New Product</h1>
        </div>
        
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-4 sm:mb-6"></div>
        
        <p className="text-sm text-gray-600 mb-4 sm:mb-6">
          What would you like to name your product? The product name will be displayed to customers and can be changed later.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Product Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. Premium Graphics Pack"
                      className="focus:ring-2 focus:ring-blue-500 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm text-gray-500">
                    Choose a clear, descriptive name for your product (maximum 50 characters).
                  </FormDescription>
                  <FormMessage className="text-red-500 text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
              <Link href="/admin/products" className="order-2 sm:order-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex items-center justify-center w-full sm:w-auto text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={!isValid || isSubmitting}
                className="order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-6"
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ProductCreatePage