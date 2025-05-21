import { getPieGraphProductCreatedByUser, getTotalProductCreatedByUser } from "@/actions/get-overiew-analytics";
import DashboardAnalyticsPage from "./_components/pie-charts";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Fetch dashboard metrics

  const userProducts = await getTotalProductCreatedByUser(userId);

  // Fetch jobs and companies by month
  const productsByMonth = await getPieGraphProductCreatedByUser(userId);


  return (
    <DashboardAnalyticsPage 
      userProducts={userProducts}
      productsByMonth={productsByMonth}
    />
  );
}