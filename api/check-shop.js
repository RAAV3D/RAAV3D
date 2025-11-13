import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  const { shopId } = req.query;

  if (!shopId) {
    return res.status(400).json({ error: "Missing shopId" });
  }

  try {
    const doc = await admin.firestore().collection("subscriptions").doc(shopId).get();

    if (doc.exists) {
      return res.status(200).json({ exists: true, data: doc.data() });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("❌ Error checking shop:", error);
    return res.status(500).json({ exists: false, error: error.message });
  }
}
