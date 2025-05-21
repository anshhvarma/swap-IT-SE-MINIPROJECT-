import { getProducts } from '@/actions/get-products';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import PageContents from './_components/page-content';
import CategoryList from './_components/category-list';
import { db } from '@/lib/db';

interface SearchPageProps {
    searchParams:{
        title: string;
        categoryId: string;
        createdAtFilter: string;
    }
}

const SearchPage = async  ({searchParams}: SearchPageProps)=> {

  const categories = await await db.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const { userId } = await auth();

  
    const products = await getProducts({...searchParams});
    
    console.log(products);

  return (
    <>
    <div className="px-6 pt-6 block md:hidden md:mb-8">
      {/* <SearchContainer /> */}
    </div>

    <div className="p-6">
      {/* categories */}
      <CategoryList categories={categories} />
      {/* applied filters */}

      {/* page content */}
      <PageContents products={products} userId={userId} />
    </div>
  </>
  )
}

export default SearchPage