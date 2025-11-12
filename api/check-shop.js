export default async function handler(req, res) {
  const { shopId } = req.query;

  // Example dummy database check (replace with real DB query)
  const validShopIds = ["123456", "654321", "987654"];

  if (validShopIds.includes(shopId)) {
    res.status(200).json({ exists: true });
  } else {
    res.status(404).json({ exists: false });
  }
}
