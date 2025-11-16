import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ───────────────────────────────────────────────
// ✅ Firebase Initialization
// ───────────────────────────────────────────────
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

// ───────────────────────────────────────────────
// 🔐 Strong CORS
// ───────────────────────────────────────────────
const allowedOrigins = [
  "https://raav2d3d.vercel.app",
  "https://www.raav2d3d.vercel.app",
  "https://raav3d.onrender.com",
  "http://127.0.0.1:5501",
  "http://localhost:5501"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "public")));

// ───────────────────────────────────────────────
// ✅ Razorpay Setup
// ───────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

// ───────────────────────────────────────────────
// ✅ Check Shop ID
// ───────────────────────────────────────────────
app.get("/check-shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    if (shopId === "572768") return res.json({ exists: true });

    const ref = db.ref(`users/${shopId}`);
    const snapshot = await ref.once("value");
    res.json({ exists: snapshot.exists() });
  } catch (err) {
    console.error("Error checking shop ID:", err);
    res.status(500).json({ exists: false });
  }
});

// ───────────────────────────────────────────────
// 🚀 NEW ROUTE #1 – Create Normal Razorpay Order
// ───────────────────────────────────────────────
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;  // amount in rupees

    const order = await razorpay.orders.create({
      amount: amount * 100,        // ₹ to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    res.status(500).json({ error: "Error creating order" });
  }
});

// ───────────────────────────────────────────────
// 🚀 NEW ROUTE #2 – Activate Subscription Plan
// ───────────────────────────────────────────────
app.post("/activate-plan", async (req, res) => {
  try {
    const { shopId, months } = req.body;

    if (!shopId || !months) {
      return res.status(400).json({ success: false, error: "Missing data" });
    }

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

    console.log(`✅ Plan Activated for Shop ID: ${shopId}`);
    res.json({ success: true });

  } catch (err) {
    console.error("❌ Plan activation failed:", err);
    res.status(500).json({ success: false });
  }
});

// ───────────────────────────────────────────────
// TEST ROUTE
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
// Root route
// ───────────────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// ───────────────────────────────────────────────
// Start Server
// ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
