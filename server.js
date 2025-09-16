// server.js (ESM версия)
import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/catalog", async (req, res) => {
  try {
    const r = await fetch(
      // "https://ivan-chohol.ua/price/facebook-catalog.xml"
      "https://www.vyshyvanka-barvy.com/wp-content/uploads/woo-feed/facebook/xml/vyshyvanka-barvy-feed.xml",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117 Safari/537.36",
        },
        redirect: "follow",
      }
    );

    if (!r.ok) {
      console.error("Upstream fetch failed:", r.status, r.statusText);
      res.status(r.status).send(`Upstream error: ${r.status} ${r.statusText}`);
      return;
    }

    const text = await r.text();
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Error fetching catalog");
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Proxy running on http://localhost:${PORT}`)
);
