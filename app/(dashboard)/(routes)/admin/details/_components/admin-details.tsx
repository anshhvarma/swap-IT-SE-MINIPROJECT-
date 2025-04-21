"use client";
import { Admin, Product } from "@prisma/client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, CalendarDays, Building } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductstabContentPage from "./product-content";

interface AdminDetailContentPageProps {
  userId: string | null;
  admin: Admin;
  products: Product[];
}

const AdminDetailContentPage = ({ admin, products, userId }: AdminDetailContentPageProps) => {
  const [activeTab, setActiveTab] = useState<"profile" | "products">("profile");

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="w-full rounded-2xl bg-white p-4 sm:px-6 md:px-10 shadow-md z-50 -mt-8">
      {/* Header Section */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between px-2 sm:px-4 -mt-10 gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-sans font-bold text-neutral-700">{admin?.collegeName}</h2>
          {admin?.name && (
            <p className="text-gray-500 text-sm">Administrator: {admin.name}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">Admin</span>
          <span className="text-gray-500 text-sm flex items-center gap-1">
            <CalendarDays size={14} />
            Joined {formatDate(new Date(admin.createdAt))}
          </span>
          <Link href={`/admin/details/${admin.id}`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Edit Profile</Button>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 border-b">
        <nav className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-4 px-1 ${
              activeTab === "profile"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 px-1 flex items-center gap-2 ${
              activeTab === "products"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Products
            <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs">
              {products.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Content Section */}
      <div className="py-6">
        {activeTab === "profile" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                {admin?.mail && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800 break-all">{admin.mail}</p>
                    </div>
                  </div>
                )}
                {admin?.mobile_number && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-800">{admin.mobile_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location Details</h3>
              <div className="space-y-4">
                {admin?.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-800">{admin.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Building className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <div className="flex flex-wrap gap-1">
                      {admin?.city && <p className="text-gray-800">{admin.city},</p>}
                      {admin?.state && <p className="text-gray-800">{admin.state}</p>}
                      {admin?.zipcode && <p className="text-gray-800">- {admin.zipcode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* College Information */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">College Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Institution Name</p>
                    <p className="text-gray-800 font-medium">{admin.collegeName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-800">{formatDate(new Date(admin.updatedAt))}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-600">
            <ProductstabContentPage products={products} userId={userId} />
            
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDetailContentPage;
