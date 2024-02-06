"use client"

import { useOrganizationList } from "@clerk/clerk-react";
import Item from "./Item";


export default function ListOrganizations() {

    const {userMemberships} = useOrganizationList({
        userMemberships:{
            infinite: true
        }
    })

    if (userMemberships?.data?.length === 0) {
        return null;
    }

  return (
    <ul className="space-y-4">
        {userMemberships?.data?.map((mem) => {
            return (
                <Item
                    key={mem.organization.id}
                    id={mem.organization.id}
                    name={mem.organization.name}
                    imgUrl={mem.organization.imageUrl}
                />
            )
        })}
    </ul>
  );
}