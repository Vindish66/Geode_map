import { Client } from "@notionhq/client";
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

  for (const page of response.results) {
    const props = page.properties;

    const nom = props.Nom?.title[0]?.plain_text;
    const lat = props.Lat?.number;
    const lng = props.Lng?.number;
    const avatar =
    page.properties.avatar?.files?.[0]?.file?.url ||
    page.properties.avatar?.files?.[0]?.external?.url ||
    null;

    console.log({ nom, lat, lng, avatar });
  }
}

console.log("Nombre de lieux récupérés :", results.length);


fetchLieux();
