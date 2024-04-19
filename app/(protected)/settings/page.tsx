"use client";

import { logOut } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";

const SettingsPage = () => {
  const user = useCurrentUser();
  const onClick = () => {
    logOut();
  };
  return (
    <div className=" bg-white p-10 rounded-xl">
      <Button size="lg" onClick={onClick} variant="ghost">
        Sign out
      </Button>
    </div>
  );
};

export default SettingsPage;
