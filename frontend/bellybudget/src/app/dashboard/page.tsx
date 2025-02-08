"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth"); // Redirect if not logged in
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
      {user && <p className="mt-2">Logged in as: {user.email}</p>}
      <button onClick={() => signOut(auth)} className="bg-red-500 text-white p-2 mt-4 rounded">
        Logout
      </button>
    </div>
  );
}
