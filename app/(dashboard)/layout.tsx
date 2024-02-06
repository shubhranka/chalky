
import { ReactNode } from "react"
import Sidebar from "./_components/Sidebar"
import OrgSidebar from "./_components/OrgSidebar"
import Navbar from "./_components/Navbar"

interface DashboardLayoutProps {
    children: ReactNode
};

const DashboardLayout = ({children} : DashboardLayoutProps) => {
    return (
        <main className="h-full">
            <Sidebar/>
            <div className="pl-[60px]">
                <div className="flex gap-x-4 h-full">
                    <OrgSidebar/>
                    <div className="h-full flex-1">
                        <Navbar/>   
                        {children}
                    </div>
                </div>
            </div>
        </main>
)
}

export default DashboardLayout