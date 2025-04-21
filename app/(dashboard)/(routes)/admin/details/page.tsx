import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminDetailContentPage from "./_components/admin-details";

const AdminDetailsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  let adminDetails = [];

try {
  adminDetails = await db.admin.findMany({ where: { userId } });
} catch (err) {
  console.error("Failed to fetch admin details:", err);
  return <div>Error connecting to the database. Please try again later.</div>;
}


  if (adminDetails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center border rounded-lg shadow-sm bg-gray-50 h-[75vh] m-5">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          No Page found
        </h3>
        <p className="mb-6 text-gray-600">
          You haven&apos;t created any page yet. Get started by creating.
        </p>
        <Link
          href="/admin/create"
          className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Create Your Admin Profile
        </Link>
      </div>
    );
  }

  const admin = adminDetails[0];

  const products = await db.product.findMany({
    where:{
      adminId: admin.id
    },
    include:{
      admin: true,
    },
    orderBy:{
      createdAt: "desc",
    }
  })

  return (
    <div className="p-6 h-full">
      <div className="p-10 pt-16">
        <AdminDetailContentPage
          products={products}
          admin={admin}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default AdminDetailsPage;
