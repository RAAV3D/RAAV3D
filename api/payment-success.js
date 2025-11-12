export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { shopId } = req.body;
  if (!shopId) return res.status(400).json({ error: "Missing shopId" });

  try {
    // Example: update Firebase or mark shop as active
    // await updateShopSubscription(shopId, true);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
