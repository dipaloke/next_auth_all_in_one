import { db } from "@/lib/db";

export const getAccountByUserId = async (userId: string) => {
  try {
    const userAccount = await db.account.findFirst({
      where: { userId },
    });
    return userAccount;
  } catch {
    return null;
  }
};
