"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <p>Signed in as {session.user.name}</p>
        <button onClick={() => signOut()} className="text-blue-500">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("github")} className="text-blue-500">
      Sign In with Github
    </button>
  );
}
