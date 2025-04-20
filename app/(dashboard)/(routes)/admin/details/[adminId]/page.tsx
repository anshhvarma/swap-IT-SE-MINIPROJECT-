// import { IconBadge } from "@/components/icon-badge";
import { IconBadge } from "@/app/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminCollegeName from "./_components/admin-college-form";
import AdminName from "./_components/admin-name-form";
import AdminMobileForm from "./_components/admin-number-form";
import AdminEmailForm from "./_components/admin-mail-form";
import AdminLocationForm from "./_components/admin-location";

const AdminEditPage = async ({params}: {params: {adminId: string}}) => {
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(params.adminId)) {
    return redirect("/admin/");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const admin = await db.admin.findUnique({
    where: {
      id: params.adminId,
      userId,
    },
  });

  if (!admin) {
    return redirect("/admin");
  }

  const requiredFields = [
    admin.name,
    admin.mobile_number,
    admin.mail,
    admin.collegeName,
    admin.location,
    admin.city,
    admin.state,
    admin.zipcode,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={"/admin/details"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium"> Admin Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
      </div>

      {/* Container Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left */}
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700"> Your Information</h2>
          </div>

          <AdminCollegeName initialData={admin} adminId={admin.id} />
          <AdminName initialData={admin} adminId={admin.id} />
       <AdminMobileForm initialData={admin} adminId={admin.id} />
          <AdminEmailForm initialData={admin} adminId={admin.id} /> 
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              {/* <IconBadge icon={Network} /> */}
              <h2 className="text-xl"> Location Details</h2>
            </div>
            <AdminLocationForm initialData={admin} adminId={admin.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditPage;
