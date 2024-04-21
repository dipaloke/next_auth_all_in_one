//Our entire application is protected (user needs to-be logged in ) except lending page, login, signup page

import authConfig from "./auth.config";
import NextAuth, { Session } from "next-auth";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "./routes";
import { NextRequest } from "next/server";

export const { auth } = NextAuth(authConfig);

export default auth(
  (req: NextRequest & { auth: Session | null }): Response | void => {
    // req.auth
    //We are going to determine what to do with a route based on isLoggedIn function
    // and the pathname of the route.
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    //apiAuthRoutes don't need anything
    if (isApiAuthRoute) return;

    //in AuthRoutes if user is logged in then redirect to settings page
    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return;
    }
    //if not logged in
    if (!isLoggedIn && !isPublicRoute) {
      //redirects back to same url from where user logged out
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);

      return Response.redirect(
        new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }
    return;
  }
);

// Optionally, don't invoke Middleware on some paths
export const config = {
  //here middleware will invoked in every route.(matcher from clerk auth. search for authMiddleware)
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
