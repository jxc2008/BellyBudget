import { db } from "../../.././lib/firebase";
import { collection, addDoc, getDocs, enableNetwork } from "firebase/firestore";

export async function GET() {
  try {
    // **Ensure Firestore is online**
    await enableNetwork(db);
    console.log("✅ Firestore network enabled");

    const mealsRef = collection(db, "meals");
    const mealsSnapshot = await getDocs(mealsRef);

    console.log("📦 Firestore response received:", mealsSnapshot.docs.length);

    const meals = mealsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(meals), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 Firestore GET Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
