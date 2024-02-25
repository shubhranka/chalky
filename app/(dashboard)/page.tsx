"use client"

import { useOrganization } from "@clerk/clerk-react";
import EmptyOrg from "./_components/EmptyOrg";
import BoardList from "./_components/BoardList";

interface DashboardProps {
    searchParams: {
        search: string;
        favourite: boolean;
    }
}

const Dashboard = ({searchParams} : any) => {

    const { organization } = useOrganization();

    return (
        <div className="flex-1 h-[calc(100%-86px)] p-6 ">
            {!organization ? (<EmptyOrg/>) : <BoardList searchParams={searchParams}/>} 
        </div>
    )
};  

export default Dashboard;