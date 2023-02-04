import http from "serverless-http";
import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { subgraphURLS } from "./utils/constants";
import { GraphQLClient } from "graphql-request";
import { GetEntity, GetEntityQuery } from "./src/generated/graphql";
import { addNewSubscription } from "./utils/addNewSubscription";
import { unmarshall } from "@aws-sdk/util-dynamodb";

dotenv.config();
const token = process.env.BOT_TOKEN!;
const bot = new Telegraf(token);

const client = new DynamoDBClient({ region: "ap-south-1" });

// echo
// bot.on("message", ctx => ctx.reply(ctx.message.));
bot.start(async (ctx) => {
  if (!ctx.update?.message?.from?.username) {
    ctx.reply(
      "Oops! You need a username to use this bot! Please visit https://questbook.app to get started!",
    );
    return;
  }

  const payload = ctx.startPayload;
  if (payload) {
    try {
      const decodedPayload = Buffer.from(payload, "base64").toString("utf8");
      const [type, entity, _chain] = decodedPayload.split("-");
      console.log("Setup notification for: ", type, entity, _chain);
      const chain = parseInt(_chain);
      if (!(chain in subgraphURLS)) throw new Error("Invalid chain");
      if (type !== "app" && type !== "gp") throw new Error("Invalid type");
      if (type === "gp" && !ethers.utils.isAddress(entity))
        throw new Error("Invalid grant address");

      // 1. Check if this is a valid grant or app ID
      const graphQLClient = new GraphQLClient(subgraphURLS[chain]);
      const res: GetEntityQuery = await graphQLClient.request(GetEntity, {
        grantId:
          type === "gp" ? entity : "0x0000000000000000000000000000000000000000",
        appId: type === "app" ? entity : "0x0",
      });

      if (type === "gp" && res.grant === null)
        throw new Error("Grant not found");
      else if (type === "app" && res.grantApplication === null)
        throw new Error("Application not found");

      // 2. Check if subscription exists
      const key = `${type}-${entity}-${_chain}`;
      const command = new GetItemCommand({
        TableName: process.env.TABLE,
        Key: { key: { S: key } },
        ProjectionExpression: "#username",
        ExpressionAttributeNames: {
          "#username": ctx.update?.message?.from?.username,
        },
      });

      let response = await client.send(command);
      const { Item } = response;
      if (Item && unmarshall(Item)[ctx.update?.message?.from?.username]) {
        ctx.reply(
          `You already have a subscription for this ${
            type === "app" ? "application" : "grant program"
          }!`,
        );
        return;
      }

      // 3. If valid, create subscription and reply with success message
      const { addSubscription } = addNewSubscription(
        key,
        type,
        entity,
        _chain,
        ctx.update?.message?.from?.username,
        ctx.update?.message?.from?.id?.toString(),
      );
      response = await client.send(addSubscription);
      if (response.$metadata.httpStatusCode === 200) {
        ctx.reply(
          `You have successfully subscribed for updates to ${
            type === "gp" ? "grant program" : "application"
          } ${
            type === "gp"
              ? res.grant?.title
              : res?.grantApplication?.title[0]?.values[0]?.value
          }.`,
        );
      }
    } catch (e) {
      console.error(e);
      ctx.reply(
        `Could not decode config! Visit https://questbook.app to contact support!`,
      );
    }
  } else {
    ctx.reply(
      "Oops! Cannot setup notifications! Please visit https://questbook.app to get started!",
    );
  }
});

bot.on("message", async (ctx) => {
  await ctx.reply(`Sorry ${ctx.from.first_name}, I do not understand that!`);
});

if (process.env.NODE_ENV === "development") {
  bot.launch();
}

// setup webhook for production
export const QBbot = http(bot.webhookCallback("/telegraf"));
