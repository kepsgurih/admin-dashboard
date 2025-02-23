import { Metadata } from "next";
import InputOnboarding from "./input-onboarding";
import { RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Onboarding - Register Companies',
    description: 'Keps ERP register your company here'
}

export default async function Page() {
    const session = await auth()
    const group = session.sessionClaims?.metadata?.group
    if(!session.userId)  return session.redirectToSignIn()
    if(group) return redirect('/apps')
    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <InputOnboarding />
        </div>
    )
}