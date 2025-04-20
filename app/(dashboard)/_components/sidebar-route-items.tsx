import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface SidebarRouteItemsProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

const SidebarRouteItems = ({icon: Icon, label, href}: SidebarRouteItemsProps) => {

    const pathname = usePathname();
    const router = useRouter();

    const isActive = (pathname === "/" && href ==="/") || 
    pathname === href || pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }

  return (
    <button 
    onClick={onClick}
    className={cn("flex items-center gap-x-2 text-neutral-500 text-sm font-[500] pl-6 transition-all hover:text-neutral-600 hover:bg-neutral-300/20",
    isActive && 
    "text-black bg-slate-300 hover:opacity-90" )}>
        <div className="flex items-center gap-x-2 py-4">
            <Icon 
            size={22} 
            className={cn("text-neutral-500",isActive && "text-black")}
            />
            {label}
        </div>
        <div className={cn("ml-auto opacity-0 border-2 border-black h-full transition-all",isActive && "opacity-100")}>
        </div>
    </button>
  )
}

export default SidebarRouteItems