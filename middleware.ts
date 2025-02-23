import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/apps(.*)'])
const onboarding = createRouteMatcher(['/onboarding(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const session = await auth()
  const group = session.sessionClaims?.metadata?.group
  if (isProtectedRoute(req) && !group) {
    const url = new URL('/onboarding', req.url)
    return NextResponse.redirect(url)  
  } else if(onboarding(req) && group) {
    const url = new URL('/apps', req.url)
    return NextResponse.redirect(url)
  } else {
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}