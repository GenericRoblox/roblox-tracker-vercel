import axios from 'axios';

export default async function handler(req, res) {
  let userId = req.query.userId;
  const username = req.query.username;

  try {
    if (!userId && username) {
      const userRes = await axios.post(
        'https://users.roblox.com/v1/usernames/users',
        { usernames: [username], excludeBannedUsers: true },
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
          }
        }
      );
      userId = userRes.data.data[0]?.id;
      if (!userId) return res.status(404).send("Username not found.");
    }

    if (!userId) return res.status(400).send("Missing userId or username.");

    let cursor = null;
    let foundBadge = null;
    let attempts = 0;

    while (attempts < 5 && !foundBadge) {
      const badgeRes = await axios.get(
        `https://badges.roblox.com/v1/users/${userId}/badges`,
        {
          params: {
            sortOrder: "Desc",
            limit: 100,
            cursor: cursor || undefined,
          },
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }
      );

      const { data, nextPageCursor } = badgeRes.data;
      if (!data || data.length === 0) break;

      for (const badge of data) {
        if (badge.awarder?.type === "Place" && badge.awarder?.id) {
          foundBadge = badge;
          break;
        }
      }

      cursor = nextPageCursor;
      attempts++;
    }

    if (!foundBadge) {
      return res.status(404).send("No badge with game info found.");
    }

    const placeId = foundBadge.awarder.id;
    const gameLink = `https://www.roblox.com/games/${placeId}`;

    return res.redirect(gameLink);

  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    return res.status(500).send("Failed to fetch Roblox data.");
  }
}
