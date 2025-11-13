import express from "express";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

app.use(cors({
  origin: [
    "https://raav2d3d.vercel.app", // your Vercel frontend
    "http://localhost:5500"        // optional: for local testing
  ],
  methods: ["GET", "POST"],
  credentials: true
}));


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

// ✅ Strong & safe CORS setup
const allowedOrigins = [
  "https://raav2d3d.vercel.app", // your frontend
  "https://www.raav2d3d.vercel.app", // just in case www
  "https://raav3d.onrender.com", // your backend itself
  "http://127.0.0.1:5501",       // for local testing
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

// Ensure OPTIONS preflight is handled
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
// ✅ Routes
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
    res.status(500).json({ success: false });
  }
});

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

// ✅ Root route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// ───────────────────────────────────────────────
// ✅ Start Server
// ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
