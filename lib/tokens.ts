import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidV4 } from "uuid";
import { db } from "./db";

//For generating password reset verification token by email

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidV4();

  //expires the token in one hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  //if an existing token is already sent or not
  const existingToken = await getVerificationTokenByEmail(email);

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
