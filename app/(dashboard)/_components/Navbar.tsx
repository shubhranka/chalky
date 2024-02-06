"use client"

import { OrganizationSwitcher, UserButton, useOrganization } from "@clerk/clerk-react";
import SearchInput from "./SearchInput";
import InviteButton from "./InviteButton";

export default function Navbar() {

  const { organization } = useOrganization();

  return (
    <div className="flex items-center gap-x-4 p-5">

        <div className="hidden lg:flex flex-1">
          <SearchInput />
        </div>
        <div className="flex-1 lg:hidden">
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
                padding: "6px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                justifyContent: "space-between",
              }
            }
          }}
        />
        </div>
        {organization && <InviteButton />}
        <UserButton />
    </div>
  );
}