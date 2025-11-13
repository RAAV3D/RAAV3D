import admin from "firebase-admin";

// ✅ Load Firebase Service Account
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// ✅ Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { shopId } = req.body;

  if (!shopId) {
    return res.status(400).json({ error: "Missing shopId" });
  }

  try {
    // ✅ Mark shop as active in Firestore
    await admin.firestore().collection("subscriptions").doc(shopId).update({
      subscriptionStatus: "active",
      activatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Subscription activated for shop: ${shopId}`);
    return res.status(200).json({ success: true, message: "Subscription activated!" });
  } catch (error) {
    console.error("❌ Error updating Firebase:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
