export const dynamic = "force-dynamic"; // 👈 Forces SSR at runtime

import { getPieGraphProductCreatedByUser, getTotalProductCreatedByUser } from "@/actions/get-overiew-analytics";
import DashboardAnalyticsPage from "./_components/pie-charts";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  const userProducts = await getTotalProductCreatedByUser(userId);
  const productsByMonth = await getPieGraphProductCreatedByUser(userId);

  return (
    <DashboardAnalyticsPage 
      userProducts={userProducts}
      productsByMonth={productsByMonth}
    />
  );
}