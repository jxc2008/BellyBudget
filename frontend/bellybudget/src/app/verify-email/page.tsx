// app/verify-email/page.tsx
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./verifyEmail.module.css";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        setIsVerified(true);
        clearInterval(interval);
        router.push("/survey");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className={`${styles.container} ${styles.fadeIn}`}>
      <h1 className={styles.title}>Verify Your Email</h1>
      <p className={styles.subtitle}>
        A verification email has been sent to your email address.
      </p>
      <p className={styles.info}>
        Please check your inbox and click the verification link.
      </p>
      <p className={styles.info}>
        Once verified, you will be automatically redirected.
      </p>
    </div>
  );
}
