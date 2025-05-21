"use client";
import { Compass, Home, List, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SidebarRouteItems from "./sidebar-route-items";
import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import DateFilter from "./date-filter";
import qs from "query-string";

const adminRoutes = [
  {
    icons: List,
    label: "Admin Details",
    href: "/admin/details",
  },
  {
    icons: List,
    label: "Products",
    href: "/admin/products",
  },
  {
    icons: List,
    label: "Analytics",
    href: "/admin/analytics",
  },
];

const guestRoutes = [
  {
    icons: Home,
    label: "Home",
    href: "/",
  },
  {
    icons: Compass,
    label: "Search",
    href: "/search",
  },
  {
    icons: User,
    label: "Saved Products",
    href: "/saved-products",
  },
];

// Define proper types for filter values
type FilterValue = string;

const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPage = pathname?.startsWith("/admin");
  const isSearchPage = pathname?.startsWith("/search");

  const routes = isAdminPage ? adminRoutes : guestRoutes;


  
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarRouteItems
          key={route.href}
          icon={route.icons}
          label={route.label}
          href={route.href}
        />
      ))}

      {isSearchPage && (
        <Box className="px-4 py-4 items-start justify-start space-y-4 flex-col">
          {/* filters section */}

          {/* Date filter */}
          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Filters
          </h2>
          <DateFilter />
        </Box>
      )}
    </div>
  );
};

export default SidebarRoutes;