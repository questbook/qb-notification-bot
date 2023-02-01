import http from "serverless-http";
import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();
const token = process.env.BOT_TOKEN!;
const bot = new Telegraf(token);

// echo
// bot.on("message", ctx => ctx.reply(ctx.message.));
bot.start((ctx) => {
  const payload = ctx.startPayload;
  if (payload) {
    try {
      const decodedPayload = Buffer.from(payload, "base64").toString("utf8");
      const [grant, _chain] = decodedPayload.split("-");
      const chain = parseInt(_chain);
      if (!ethers.utils.isAddress(grant))
        throw new Error("Invalid grant address");
      ctx.reply(`Deep link payload: ${JSON.stringify({ grant, chain })}`);
    } catch (e) {
      ctx.reply(
        `Could not decode config! Visit https://questbook.app to contact support!`,
      );
    }
  } else {
    ctx.reply(
      "Oops! Cannot initialize bot! Please visit https://questbook.app to get started!",
    );
  }
});

bot.on("message", async (ctx) => {
  await ctx.reply(
    `Sorry ${ctx.from.first_name}, we do not support this message!`,
  );
});

// bot.launch();

// setup webhook for production
export const QBbot = http(bot.webhookCallback("/telegraf"));
