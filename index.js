import { Client, GatewayIntentBits } from "discord.js";
import { Client as NotionClient } from "@notionhq/client";

import { config } from "dotenv";

config();
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const notionSecret = process.env.NOTION_SECRET;

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const notion = new NotionClient({ auth: notionSecret });

async function writeToNotion(user, message) {
  const response = await notion.pages.create({
    cover: {
      type: "external",
      external: {
        url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg",
      },
    },
    icon: {
      type: "emoji",
      emoji: "🥬",
    },
    parent: {
      type: "database_id",
      database_id: process.env.NOTION_DB_2,
    },
    properties: {
      User: {
        title: [
          {
            text: {
              content: user,
            },
          },
        ],
      },

      Message: {
        rich_text: [
          {
            text: {
              content: message,
            },
          },
        ],
      },
    },
    children: [],
  });
}

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});
discordClient.on("messageCreate", async (message) => {
  if (message.content.toLowerCase().includes("notintel"))
    await writeToNotion(message.author.tag, message.content);
});
discordClient.login(DISCORD_BOT_TOKEN);
