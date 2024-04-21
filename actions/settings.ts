"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { settingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof settingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized!" };
  }
  //to make sure the user is not from cash or session but from db.

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized!" };
  }

  //checking if user is logged in via credentials or OAuth

  if (user.isOAuth) {
    //OAuth users cant modify this fields as they are handled by the provider
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  //only send validation code to change email if new email is different from previous one

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    //return error if provided email is already registered
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use. Please provide a new email" };
    }
    //generate the token and send it to new  email
    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent." };
  }

  //checking for password & new password
  if (values.password && values.newPassword && dbUser.password) {
    //checking for password field matching is password in db or not
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordMatch) {
      return {
        error:
          "Incorrect Password. Provide your current password to password field!",
      };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  //updating all values user needs to update.
  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Settings updated!" };
};
