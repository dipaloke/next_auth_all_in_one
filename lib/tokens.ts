import crypto from "crypto";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidV4 } from "uuid";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

//For generating twoFactor Authentication token by email

export const generateTwoFactorToken = async (email: string) => {
  //token will be a 6 digit code.
  const token = crypto.randomInt(100_000, 1_000_000).toString(); // same as writing 100000 & 1000000
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000); //15 minutes
  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return twoFactorToken;
};

//For generating password reset verification token by email

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidV4();

  //expires the token in one hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  //if an existing token is already sent or not
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

// For generating email Verification token
export const generateVerificationToken = async (email: string) => {
  const token = uuidV4();

  //expires the token in one hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  //if an existing token is already sent or not
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
