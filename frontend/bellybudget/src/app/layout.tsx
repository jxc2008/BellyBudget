import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BellyBudget",
  description: "BellyBudget App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>BellyBudget</title>
      </head>
      <body>
        <div
          style={{
            backgroundColor: "purple",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            margin: "0 auto",
            marginTop: "calc(50vh - 25px)",
          }}
        ></div>
      </body>
    </html>
  );
}
