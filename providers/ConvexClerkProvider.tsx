"use client"

import { Loading } from "@/components/auth/loading";
import { ClerkProvider, UserButton, useAuth } from "@clerk/clerk-react";
import { AuthLoading, Authenticated, ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { LogOut } from "lucide-react";

const convexUrl : string = process.env.NEXT_PUBLIC_CONVEX_URL!
const publishKey : string = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!
const convex = new ConvexReactClient(convexUrl)

interface ConvexClerkProviderProps {
    children: React.ReactNode;
}

const ConvexClerkProvider = ({ children }: ConvexClerkProviderProps) => {
    return (
        <ClerkProvider publishableKey={publishKey}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <Authenticated>
                    {children}
                </Authenticated>
                <Unauthenticated>
                    <LogOut />
                </Unauthenticated>
                <AuthLoading>
                    <Loading />
                </AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}

export default ConvexClerkProvider;