import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import admin from "firebase-admin";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "raav3d-50f8c",
      clientEmail: process.env.FIREBASE_ADMIN_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://raav3d-50f8c-default-rtdb.firebaseio.com",
  });
}

const db = admin.database();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

// ---------- CREATE ORDER ----------
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "Order failed" });
  }
});

// ---------- VERIFY PAYMENT ----------
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shopId,
      months,
    } = req.body;

    const digest = crypto
      .createHmac("sha256", process.env.RAZOR_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (digest !== razorpay_signature)
      return res.json({ success: false });

    const userRef = db.ref(`users/${shopId}`);
    const now = new Date();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + parseInt(months));

    await userRef.update({
      subscriptionStatus: "active",
      subscriptionMonths: months,
      subscriptionActivatedAt: now.toISOString(),
      subscriptionExpiresAt: expiry.toISOString(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success: false });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running")
);
