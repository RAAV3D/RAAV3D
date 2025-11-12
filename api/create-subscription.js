import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { planId, shopId } = req.body;
  if (!planId || !shopId)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 1,
      customer_notify: 1,
    });

    res.status(200).json({ id: subscription.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
