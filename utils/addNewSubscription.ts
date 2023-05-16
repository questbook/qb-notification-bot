import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const addNewSubscription = (
  key: string,
  username: string,
  chatId: string
) => {
  const addSubscription = new UpdateItemCommand({
    TableName: process.env.TABLE,
    Key: { key: { S: key } },
    UpdateExpression: "SET #username = :username",
    ExpressionAttributeNames: {
      "#username": username,
    },
    ExpressionAttributeValues: {
      ":username": { N: chatId },
    },
  });

  return { addSubscription };
};

export { addNewSubscription };
