"use client"
import { Admin, Product } from "@prisma/client";
import React, { useState } from "react";

interface AdminDetailContentPageProps {
userId : string | null;
admin : Admin;
products : Product[]
}


const AdminDetailContentPage = ({userId, admin, products}: AdminDetailContentPageProps) => {



  return (
    <div className="w-full rounded-2xl bg-white p-4 z-50 -mt-8 px-10">
    <div className="flex-col w-full px-4">
      <div className="w-full flex items-center justify-between -mt-12">
        <div className="flex items-end justify-end space-x-4">
          {/* name and all */}
          <div className="flex-col space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-sans font-bold text-neutral-700">
                {admin?.collegeName}
              </h2>
            </div>
        </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default AdminDetailContentPage