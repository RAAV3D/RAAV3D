import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();   // ✅ Load .env variables

// ✅ Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "raav3d-50f8c", // your Firebase project ID
      clientEmail: process.env.FIREBASE_ADMIN_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://raav3d-50f8c-default-rtdb.firebaseio.com",
  });
}

// ✅ Database reference (Realtime DB)
const db = admin.database();

// ───────────────────────────────────────────────
// Express + Razorpay setup
// ───────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

// ───────────────────────────────────────────────
// ✅ NEW: Check if Shop ID exists in Firebase
// ───────────────────────────────────────────────
app.get("/check-shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    // Lifetime free shop is always valid
    if (shopId === "572768") {
      return res.json({ exists: true });
    }

    const ref = db.ref(`users/${shopId}`);
    const snapshot = await ref.once("value");

    // Respond based on existence in Firebase
    res.json({ exists: snapshot.exists() });
  } catch (err) {
    console.error("Error checking shop ID:", err);
    res.status(500).json({ exists: false });
  }
});

// ───────────────────────────────────────────────
// Create Razorpay subscription
// ───────────────────────────────────────────────
app.post("/create-subscription", async (req, res) => {
  try {
    const { planId, shopId } = req.body;

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 1,
    });

    res.json({ id: subscription.id });
  } catch (err) {
    console.error("Subscription creation failed:", err);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// ───────────────────────────────────────────────
// ✅ After-payment route: Mark subscription active in Firebase
// ───────────────────────────────────────────────
app.post("/payment-success", async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) return res.status(400).send("Missing shopId");

    const userRef = db.ref(`users/${shopId}`);
    await userRef.update({
      subscriptionStatus: "active",
      subscriptionActivatedAt: new Date().toISOString(),
    });

    console.log(`✅ Firebase updated for shopId: ${shopId}`);
    res.json({ success: true, message: "Subscription activated!" });
  } catch (err) {
    console.error("❌ Firebase update failed:", err);
    res.status(500).json({ success: false, error: "Failed to update Firebase" });
  }
});

// ───────────────────────────────────────────────
// ✅ Test route to confirm Firebase connection
// ───────────────────────────────────────────────
app.get("/test-firebase", async (req, res) => {
  try {
    const ref = db.ref("test_connection");
    await ref.set({ connected: true, time: new Date().toISOString() });
    res.send("✅ Firebase Admin is connected and working!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Firebase connection failed!");
  }
});

// ───────────────────────────────────────────────
// Start the server
// ───────────────────────────────────────────────
app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`)
);
