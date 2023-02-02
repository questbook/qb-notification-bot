import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const addNewSubscription = (type: string, entity: string, chain: string, username: string, chatId: string) => {
    const addEntity = new UpdateItemCommand({
      TableName: process.env.TABLE,
      Key: { "type": { S: type } },
      UpdateExpression: "SET #entity = if_not_exists(#entity, :entity)",
      ExpressionAttributeNames: {
        "#entity": entity,
      },
      ExpressionAttributeValues: {
        ":entity": { M: {  } },
      },
    });
  
    const addChain = new UpdateItemCommand({
      TableName: process.env.TABLE,
      Key: { "type": { S: type } },
      UpdateExpression: "SET #entity.#chain = if_not_exists(#entity.#chain, :chain)",
      ExpressionAttributeNames: {
        "#entity": entity,
        "#chain": chain,
      },
      ExpressionAttributeValues: {
        ":chain": { M: {  } },
      },
    });
  
    const addSubscription = new UpdateItemCommand({
      TableName: process.env.TABLE,
      Key: { "type": { S: type } },
      UpdateExpression: "SET #entity.#chain.#username = :username",
      ExpressionAttributeNames: {
        "#entity": entity,
        "#chain": chain,
        "#username": username,
      },
      ExpressionAttributeValues: {
        ":username": { N: chatId },
      },
    });
  
    return { addEntity, addChain, addSubscription }
  };

export { addNewSubscription }