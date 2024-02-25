"use client"

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function OrgSidebar() {

  const searchParams = useSearchParams();
  const favourite = searchParams.get("favourite");

  return (
    <aside className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href={"/"}>
        <div className="flex gap-x-2 items-center">
          <Image alt="Logo" src="/logo.svg" width={50} height={24} />
          <span className={cn(
            "font-semibold text-2xl",
            font.className
          )}>Chalky</span>
        </div>
      </Link>
      <OrganizationSwitcher 
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              width: "100%",
              // padding: "6%",
              justifyContent: "space-between",
            }
          }
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          asChild
          variant={favourite ? "ghost" : "secondary"}
          size={"lg"}
          className="font-normal justify-start px-2 w-full"
        >
          <Link href="/">
            <LayoutDashboard className="h-4 w-4 mr-2"/>
              Team Dashboard
          </Link>
        </Button>
        <Button
          asChild
          variant={favourite ? "secondary" : "ghost"}
          size={"lg"}
          className="font-normal justify-start px-2 w-full"
        >
          <Link href={{
            pathname: "/",
            query: { favourite: "true" }
          
          }}>
            <Star className="h-4 w-4 mr-2"/>
              Favourite Dashboard
          </Link>
        </Button>
      </div>
    </aside>
  );
}