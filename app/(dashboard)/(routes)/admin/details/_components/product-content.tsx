
import { Product } from "@prisma/client";
import PageContents from "../../../search/_components/page-content";

interface JobContentPageProps{
  userId : string | null;
  products: Product[]
}

const ProductstabContentPage = ({products, userId}: JobContentPageProps) => {
  return <PageContents products={products} userId={userId}/>
}

export default ProductstabContentPage