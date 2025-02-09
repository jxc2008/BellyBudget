"use client";

import { useState } from "react";
import { auth } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    setError("");

    // Use a stricter regex for validating emails.
    // This regex requires an "@" and a period with at least 2 characters following it.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        // Create a new user and send a verification email
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await sendEmailVerification(user);
        // After sign-up, redirect to the verify email page
        router.push("/verify-email");
      }
    } catch (err: any) {
      // If attempting to log in and the user isn't found, force them to sign up.
      if (isLogin && err.code === "auth/user-not-found") {
        setError("No user found. Please sign up first.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className={styles.subtitle}>
          {isLogin
            ? "Log in to access your account"
            : "Sign up to get started"}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuth();
          }}
          className={styles.form}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className={styles.toggle} onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Need an account? Sign Up"
            : "Already have an account? Log In"}
        </p>

        {/* Back to Home Button */}
        <button
          className={styles.backButton}
          onClick={() => router.push("/")}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
