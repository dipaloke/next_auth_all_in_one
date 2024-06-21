/**
 * Flow:
 * 1. stars with token in jwt callback which contains id as sub field.
 * 2. then extend the token by querying for the existing user to get the role
 * 3. add the userId(sub from token) & user role to our session.
 */

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

//without this module typescript will show error for user.role in session callback.
//see documentation in https://authjs.dev/getting-started/typescript

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
    async signIn({ user, account }) {
      //allow Oauth without email verification
      //IMPORTANT: Need to change this logic if we add more providers
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);

      //prevent signIn without email Verification
      if (!existingUser?.emailVerified) return false;

      //add 2FA check

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) return false;

        //delete two factor confirmation for next sign-in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        // including the user Id from token to our session
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      //adding 2FA into session
      if (typeof token.isTwoFactorEnabled === "boolean" && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      //if user not logged in
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      //if not correct user id

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount; // !! makes boolean
      //adding role into token
      token.role = existingUser.role;

      token.name = existingUser.name;
      token.email = existingUser.email;

      //adding 2FA enabled or not into token
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

