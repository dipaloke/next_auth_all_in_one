import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidV4 } from "uuid";
import { db } from "./db";

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
