import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const response = await fetch(
      "https://ivan-chohol.ua/price/facebook-catalog.xml"
    );
    const xml = await response.text();

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=3600");
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch catalog" });
    console.error("Failed to fetch catalog, error: ", err);
  }
};
