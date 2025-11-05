import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/api/ownership", async (req, res) => {
  const { username, gamepassId } = req.query;

  if (!username || !gamepassId)
    return res.status(400).json({ error: "Missing username or gamepassId" });

  try {
    // Step 1: Get user ID by username
    const userRes = await fetch(`https://api.roblox.com/users/get-by-username?username=${username}`);
    const userData = await userRes.json();
    if (!userData.Id) return res.json({ owned: false, error: "User not found" });

    // Step 2: Check gamepass ownership
    const ownershipRes = await fetch(`https://inventory.roblox.com/v1/users/${userData.Id}/items/GamePass/${gamepassId}`);
    const ownershipData = await ownershipRes.json();

    const owned = ownershipData.data && ownershipData.data.length > 0;
    res.json({ owned, userId: userData.Id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to connect to Roblox API" });
  }
});

app.listen(PORT, () => console.log(`✅ Roblox Proxy running on port ${PORT}`));
