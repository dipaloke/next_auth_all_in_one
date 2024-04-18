"use server";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  //server side validation is necessary coz clint side validation could be forged
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  //user does not exist
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  //user exists but email not verified
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    //sending the email
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Your Email is not verified. Confirmation Email sent" };
  }

  //implementing 2FA

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      //verify authentication code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }
      if (twoFactorToken.token !== code) return { error: "Invalid code" };

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired)
        return { error: "Authentication code has expired. Please try again." };

      //remove 2fa token & create two factor confirmation so users can login

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      //when {twoFactor: true} the frontend will know to change login display to authentication code input display
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Provided Email or Password is incorrect" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
