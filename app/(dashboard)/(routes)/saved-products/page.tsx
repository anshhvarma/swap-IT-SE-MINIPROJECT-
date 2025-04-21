
import { getProducts } from "@/actions/get-products";
import Box from "@/components/box";
import SearchContainer from "@/components/search-container";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageContents from "../search/_components/page-content";

interface SearchProps {
  searchParams:{
      title: string;
      categoryId: string;
      createdAtFilter: string;
  }
}

const SavedProductPage = async ({searchParams} : SearchProps) => {

  const {userId} = await auth();

  if(!userId){
    redirect("/")
  }

  const products = await getProducts({...searchParams, savedProducts:true});

  return (
    <div className="flex-col">
      <Box className=" w-full h-44 bg-blue-600/20 justify-center">
        <h2 className="font-sans uppercase text-3xl tracking-wider font-bold">
          Saved Jobs
        </h2>
      </Box>
      <div className="px-6 pt-6 md:mb-0">
      <SearchContainer />
      </div>

      <div className="p-4">
        <PageContents products={products} userId={userId}/>
      </div>
    </div>
  )
}

export default SavedProductPage