import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";

//checking the LoginSchema validator again
//so user can't bypass and send credentials to /api/auth/[...nextauth] route.

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          //checking if email is in our DB
          const user = await getUserByEmail(email);

          //user will not have password if they register via google or github(user didn't register manually)
          if (!user || !user.password) return null;

          //matching password with our stored hashed password from DB
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
