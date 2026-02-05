import { Client } from "@notionhq/client";
import fs from "fs";
import "dotenv/config";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function fetchLieux() {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
  });

  console.log("Nombre d'entrées :", response.results.length);

  const lieux = [];

  for (const page of response.results) {
    const props = page.properties;
    console.log(props.avatar);
    const nom = props.Nom?.title[0]?.plain_text ?? null;
    const lat = props.Lat?.number ?? null;
    const lng = props.Lng?.number ?? null;
    const avatar =
      props.avatar?.files?.[0]?.file?.url ||
      props.avatar?.files?.[0]?.external?.url ||
      null;

    lieux.push({ nom, lat, lng, avatar });
  }

  console.log("Nombre de lieux construits :", lieux.length);
  console.log("Écriture de data/lieux.json");

  fs.writeFileSync(
    "data/lieux.json",
    JSON.stringify(lieux, null, 2),
    "utf-8"
  );
}

fetchLieux();

