import Razorpay from "razorpay";
import admin from "firebase-admin";

// ✅ Load Firebase credentials from Environment Variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// ✅ Initialize Firebase only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Main API Route
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { amount, shopId } = req.body;

    // ✅ Create a Razorpay order
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `order_rcptid_${shopId}`,
    };

    const order = await razorpay.orders.create(options);

    // ✅ (Optional) Save to Firebase Firestore for tracking
    await admin.firestore().collection("subscriptions").doc(shopId).set({
      shopId,
      amount,
      orderId: order.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // ✅ Return the order details
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("❌ Error creating subscription:", error);
    res.status(500).json({ error: error.message });
  }
}
