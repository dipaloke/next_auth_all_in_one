"use server";

import { currentRole } from "@/lib/auth";

export const admin = async () => {
  const role = await currentRole();

  if (role === "ADMIN") {
    return { success: "Allowed server action!" };
  }
  return { error: "Forbidden server action!" };
};
