import {
  DynamoDBClient,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { GraphQLClient } from "graphql-request";
import { Telegraf } from "telegraf";
import {
  GetEntity,
  GetEntityQuery,
  GetNotifications,
  GetNotificationsQuery,
} from "../src/generated/graphql";
import { permittedNotificationTypes, subgraphURLS } from "./constants";
import { getMessage } from "./getMessage";
import { sleep } from "./sleep";

export const run = async (event: APIGatewayProxyEvent, context: Context) => {
  try{
  // 1. Get the current timestamp
  const date = new Date();
  const currentTimestamp = Math.floor(date.getTime() / 1000);

 // 2. Last fetched timestamp 
 const client = new DynamoDBClient({ region: "ap-south-1" });
  const lastFetchedTimestamp = currentTimestamp - 60 * 5; // 5 minutes ago
  console.log("lastFetchedTimestamp: ", lastFetchedTimestamp, currentTimestamp);

  // 3. Fetch the notifications from the subgraph
  const chain = 10;
  const first = 100;
  const skip = 0;

  const graphQLClient = new GraphQLClient(subgraphURLS[chain]);
  const notifs: GetNotificationsQuery["notifications"] = [];

  const res: GetNotificationsQuery = await graphQLClient.request(
    GetNotifications,
    {
      first,
      skip,
      from: lastFetchedTimestamp,
      to: currentTimestamp,
    }
  );

  if (!res.notifications || res.notifications.length === 0) {
    console.log("No new notifications found on chain id: ", chain);
    return;
  }

  notifs.push(...res.notifications);

  const bot = new Telegraf(process.env.BOT_TOKEN);
  const receivedUsers: string[] = [];

  for (const notif of notifs) {
    if (permittedNotificationTypes.indexOf(notif.type) === -1) continue;

    const entityInfo: GetEntityQuery = await graphQLClient.request(
      GetEntity,
      {
        grantId:
          notif.entityIds.find((e) => e.startsWith("grant"))?.split("-")[1] ??
          "0x0000000000000000000000000000000000000000",
        appId:
          notif.entityIds
            .find((e) => e.startsWith("application"))
            ?.split("-")[1] ?? "0x0",
        timestamp: notif.cursor,
      }
    );

    for (const entity of notif.entityIds) {
      // 1. Fetch the list of users subscribed to this entity
      let type = entity.startsWith("grant")
        ? "gp"
        : entity.startsWith("application")
          ? "app"
          : "";
      if (type === "") continue;

      const key = `${type}-${entity.split("-")[1]}-${chain}`;
      const command = new GetItemCommand({
        TableName: process.env.TABLE,
        Key: { key: { S: key } },
      });

      const response = await client.send(command);
      if (response?.$metadata?.httpStatusCode !== 200) {
        console.log(
          `Could not fetch subscribed IDs for entity: ${entity} (${notif.id})`
        );
      }

      if (!response?.Item) continue;

      const users = unmarshall(response?.Item);
      delete users.key;

      // 2. Send a notification to each user - based on what type of notification it is
      let count = 0;

      const message = await getMessage(
        type as "gp" | "app",
        chain.toString(),
        entityInfo,
        notif
      );

      if (message === "") continue;

      for (const user in users) {
        if (receivedUsers.find(element => element==user)) continue;
        receivedUsers.push(user);

        console.log(user, users[user]);

        const chatId = users[user];
        try {
          await bot.telegram.sendMessage(chatId, message, {
            parse_mode: "HTML",
          });
          ++count;
          if (count > 20) {
            // Wait for 1 second if the list of users > 20 - since Telegram only permits 30 messages per second
            count = 0;
            await sleep(1000);
          }
        } catch (e) {
          console.error("Error sending message to chatId: ", chatId, e);
        }
      }

      await sleep(1000);
    }
  }

  console.log("Finished sending notifications");
  } catch (e) {
    console.log(`Error: ${e}`);
  }
};
