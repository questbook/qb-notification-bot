import http from "serverless-http";
import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { ethers } from "ethers";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { subgraphURLS } from "./utils/constants";
import fetch from "cross-fetch";
import { GraphQLClient } from "graphql-request";
import { GetEntity, GetEntityQuery } from "./src/generated/graphql";
import { addNewSubscription } from "./utils/addNewSubscription";

dotenv.config();
const token = process.env.BOT_TOKEN!;
const bot = new Telegraf(token);

const client = new DynamoDBClient({ region: "ap-south-1" });

// echo
// bot.on("message", ctx => ctx.reply(ctx.message.));
bot.start(async (ctx) => {
  if (!ctx.from.username) {
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
      const chain = parseInt(_chain);
      if (!(chain in subgraphURLS)) throw new Error("Invalid chain");
      if (type !== "app" && type !== "gp") throw new Error("Invalid type");
      if (type === "gp" && !ethers.utils.isAddress(entity))
        throw new Error("Invalid grant address");
      else if (type == "app" && parseInt(entity) <= 0)
        throw new Error("Invalid app id");

      // 1. Check if this is a valid grant or app ID
      const graphQLClient = new GraphQLClient(subgraphURLS[chain]);
      const res: GetEntityQuery = await graphQLClient.request(GetEntity, {
        grantId: type === "gp" ? entity : ethers.utils.hexZeroPad("0", 20),
        appId: type === "app" ? parseInt(entity) : 0,
      });

      if (type === "gp" && res.grant === null)
        throw new Error("Grant not found");
      else if (type === "app" && res.grantApplication === null)
        throw new Error("Application not found");

      // 2. Check if subscription exists
      const command = new GetItemCommand({
        TableName: process.env.TABLE,
        Key: { type: { S: type } },
        ProjectionExpression: "#entity.#chain.#username",
        ExpressionAttributeNames: {
          "#entity": entity,
          "#chain": _chain,
          "#username": ctx.from.username,
        },
      });

      let response = await client.send(command);
      if (response?.Item) {
        ctx.reply(
          `You already have a subscription for this ${
            type === "app" ? "application" : "grant program"
          }!`,
        );
        return;
      }

      // 3. If valid, create subscription and reply with success message
      const { addEntity, addChain, addSubscription } = addNewSubscription(type, type === 'gp' ? entity : parseInt(entity).toString(16), _chain, ctx.from.username, ctx.from.id.toString());
      response = await client.send(addEntity);
      if (response.$metadata.httpStatusCode === 200) {
        response = await client.send(addChain);
        if (response.$metadata.httpStatusCode === 200) {
          response = await client.send(addSubscription);
          if (response.$metadata.httpStatusCode === 200) {
            ctx.reply(
              `You have successfully subscribed for updates to ${type === 'gp' ? 'grant program' : 'application'} ${type === 'gp' ? res.grant?.title : res?.grantApplication?.title}.`,
            );
          }
        }
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
  await ctx.reply(
    `Sorry ${ctx.from.first_name}, we do not support this message!`,
  );
});

if (process.env.NODE_ENV === "development") {
  bot.launch();
}

// setup webhook for production
export const QBbot = http(bot.webhookCallback("/telegraf"));
