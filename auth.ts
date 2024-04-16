/**
 * Flow:
 * 1. stars with token in jwt callback which contains id as sub field.
 * 2. then extend the token by querying for the existing user to get the role
 * 3. add the userId(sub from token) & user role to our session.
 */

import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";

//without this module typescript will show error for user.role in session callback.
//see documentation in https://authjs.dev/getting-started/typescript

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    //Oauth redirects users to this page.
    signIn: "/auth/login",
    //if something breaks Oauth will show the following
    // custom error page instead of its default
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        //auto updating the emailVerified filed for users using Oauth
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    // async signIn({ user }) {
    //   const existingUser = await getUserById(user.id as string);

    //   if (!existingUser || !existingUser.emailVerified) return false;

    //   return true;
    // },
    async session({ token, session }) {
      if (token.sub && session.user) {
        // including the user Id from token to our session
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      //if user not logged in
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      //if not correct user id

      if (!existingUser) return token;

      //adding role into token
      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
