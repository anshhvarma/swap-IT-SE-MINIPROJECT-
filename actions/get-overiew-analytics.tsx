import { db } from "@/lib/db";

export const getTotalProductCreatedByUser = async (userId: string | null) => {
  if (!userId) {
    return 0;
  }
  const products = await db.product.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.length;
};

  // Type definition for the monthly count
  type PieChartMonthlyCount = {
    name: string;
    value: number;
  };


export const getPieGraphProductCreatedByUser = async (userId: string | null) => {
  if (!userId) {
    return [];
  }

  const products = await db.product.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const currentYear = new Date().getFullYear();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Initialize result array with all months of the current year
  const monthlyCount: PieChartMonthlyCount[] = months.map((month, index) => ({
    name: month,
    value: 0
  }));

  // Create a lookup object for easy access
  const monthlyCountLookup: { [key: string]: PieChartMonthlyCount } = monthlyCount.reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {} as { [key: string]: PieChartMonthlyCount });

  // Count jobs for each month
  products.forEach((product) => {
    const createdAt = new Date(product.createdAt);
    const month = createdAt.toLocaleString('default', { month: 'short' });
    const year = createdAt.getFullYear();

    if (year === currentYear) {
      if (monthlyCountLookup[month]) {
        monthlyCountLookup[month].value++;
      }
    }
  });

  return monthlyCount;
};

