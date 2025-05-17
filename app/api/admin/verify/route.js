// pages/api/admin/verify.js

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { employeeId, storeNumber } = req.body;

  // Replace with your own verification logic (static or DB)
  const isValid = employeeId === "CFA123" && storeNumber === "0021";

  if (!isValid) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  return res.status(200).json({ message: "Verified" });
}
