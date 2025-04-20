import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Product } from "@prisma/client";

type GetProducts = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
//   rate? : string;
  savedProducts?: boolean;
};


export const getProducts = async ({
    title,
    categoryId,
    createdAtFilter,
    savedProducts,
    // rate,
}: GetProducts) : Promise<Product[]> => {

const {userId} = await auth();

try {
    let query : any = {
        where: {
            isPublished: true,
        },
        include :{
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    }

    if(typeof title !== "undefined" || typeof categoryId !== "undefined"){
        query.where ={
            AND : [
                typeof title !== "undefined" && {
                    title : {
                        contains : title,
                        mode : "insensitive"
                    }
                },
                typeof categoryId !== "undefined" && {
                    categoryId : {
                        equals : categoryId
                    }
                }
            ].filter(Boolean)
        }
    }

    //check wheter craetedatFikter isprovided or not

    if(createdAtFilter){
        const currentDate = new Date();
        let startDate : Date;
        switch(createdAtFilter){
            case"today":
            startDate = new Date(currentDate);
            break;

            case "yesterday": 
            startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate()-1);
            break;

            case "thisWeek": 
            startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate()- currentDate.getDay());
            break;

            case "lastWeek": 
            startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate()- currentDate.getDay() - 7);
            break;

            case "thisMonth": 
            startDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1
            )
            break;
            
            default:
            startDate = new Date(0);
        }

        //add the condition in query

        query.where.createdAt = {
            gte: startDate,
        }
    }


    if(savedProducts){
        query.where.savedUsers = {
            has: userId,
        }
    }

    const products = await db.product.findMany(query);
    return products;

} catch (error) {
    console.log(`[GET_PRODUCT] : ${error}`);
    return [];
}
}