"use client";

import { useEffect, useState } from "react";
import { signInWithGoogle, logOut, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function Auth({ onUserChange }: { onUserChange: (user: User | null) => void }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      onUserChange(currentUser);
    });
    return () => unsubscribe();
  }, [onUserChange]);

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <span className="text-gray-700">{user.displayName}</span>
          <Button variant="outline" onClick={logOut}>로그아웃</Button>
        </>
      ) : (
        <Button onClick={signInWithGoogle} className="bg-blue-600 text-white">
          Google 로그인
        </Button>
      )}
    </div>
  );
}
