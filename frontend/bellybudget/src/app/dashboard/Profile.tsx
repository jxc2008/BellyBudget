"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import styles from "./dashboard.module.css";

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load user data from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage("No authenticated user found.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      await setDoc(
        doc(db, "users", user.uid),
        { firstName, lastName },
        { merge: true }
      );

      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change with reauthentication
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.email) {
      setMessage("No authenticated user found.");
      return;
    }

    if (!oldPassword || !newPassword) {
      setMessage("❌ Please enter both old and new passwords.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("❌ New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setMessage("✅ Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);

      if (error.code === "auth/wrong-password") {
        setMessage("❌ Incorrect old password. Please try again.");
      } else if (error.code === "auth/weak-password") {
        setMessage("❌ New password is too weak. Try a stronger one.");
      } else if (error.code === "auth/too-many-requests") {
        setMessage(
          "❌ Too many failed attempts. Try again later or reset your password."
        );
      } else {
        setMessage(`❌ Error updating password: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.sectionTitle}>Profile</h2>
      {message && <p className={styles.message}>{message}</p>}

      {/* Display Email */}
      <div className={styles.card}>
        <p>
          <strong>Email:</strong> {user?.email || "No email available"}
        </p>
      </div>

      {/* Update Profile Form */}
      <div className={styles.card}>
        <form onSubmit={handleUpdateProfile}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.label}>
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className={styles.input}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className={styles.input}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className={styles.card}>
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className={styles.formGroup}>
            <label htmlFor="oldPassword" className={styles.label}>
              Old Password
            </label>
            <input
              id="oldPassword"
              type="password"
              className={styles.input}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* 🔴 Welcome Message & Logout Button (Added at the Bottom) */}
      <div className={styles.welcomeContainer}>
        <h2 className={styles.welcomeMessage}></h2>
        <button
          className={styles.logoutButton}
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
