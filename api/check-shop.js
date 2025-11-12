export default async function handler(req, res) {
  const { shopId } = req.query;

  // Dummy check (replace this with real DB query later)
  const validShopIds = ["123456", "654321", "111111"];

  if (validShopIds.includes(shopId)) {
    res.status(200).json({ exists: true });
  } else {
    res.status(200).json({ exists: false });
  }
}
