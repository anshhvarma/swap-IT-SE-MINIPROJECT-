import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import {format} from "date-fns"

import { ProductsColumns, columns } from './_components/columns'

const page = async () => {


  const {userId} = await auth()

  if(!userId){
    return redirect("/")
  }

  const products = await db.product.findMany({
    where:{
      userId
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const formattedJobs: ProductsColumns[] = products.map((product) => ({
    id: product.id,
    title : product.title,
    category : product.category ? product.category?.name : "N/A",
    isPublished : product.isPublished,
    createdAt : product.createdAt ? format(product.createdAt.toLocaleString(), "MMMM do, yyyy") : "N/A",
  }));

  

  return (
    <div className='p-6 '>
      <div className='flex items-end justify-end'>
        <Link href={"/admin/products/create"}>
          <Button>
            <Plus className='h-5 w-5 mr-2'/>
            Upload Product
          </Button>
        </Link>
      </div>

      {/* DataTable - List of Jobs */}
      <div className='mt-6'>
        <DataTable columns={columns} data={formattedJobs} searchKey="title"/>
      </div>
    </div>
  )
}

export default page