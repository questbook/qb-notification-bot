# Questbook Telegram Notification Bot

Welcome to the repository for our [Questbook Telegram Bot](https://t.me/qb_notif_bot) webhook, an efficient and scalable solution that manages new subscription requests and periodically sends out messages to subscribed users. This webhook is designed using the pub-sub architecture.

This Telegram bot enables users to subscribe or unsubscribe from grant program updates, allowing them to receive periodic messages containing relevant. Leveraging the pub-sub pattern, the bot is capable of managing a high volume of subscription requests and messages, all while maintaining a responsive user experience.

## Repository Structure

- `src/generated/graphql.ts`: Contains the source code for the webhook.
- `graphql/`: Contains configuration files for setting up the webhook and API credentials.
  - `getNotifications.graphql`: This is the query that is run every 5 minutes to fetch the list of pending notifications.
  - `getEntity.graphql`: This query gets more detail about the entities that a notification comprises of (typically the grant program and proposal details).
- `utils/`: Contains utility functions that help sustain this service.
  - `addNewSubscription.ts`: This file contains the code for adding a new subscription to AWS Dynamo DB. It simply puts the new data into the database.
  - `constants.ts`: A set of constants that are used across files.
  - `getDashboardLink.ts`: Constructs the link for the dashboard, based on the grant id and proposal id. Also takes into account the chain that the grant program is on and generates a link accordingly (beta for testnets, production for mainnets)
  - `getMessage.ts`: One of the most important utility functions that decides how the message that the user receives should look like
  - `sendNotifications.ts`: The most important function that serves as the cron job for sending out notifications. It does the queries, sends the messages and updates the databases.
  - `sleep.ts`: A utility function that pauses service execution for `n` number of seconds
- `codegen.ts`: This contains the config for generating the types out of the graph QL schema
- `index.ts`: Contains the code for handling the incoming messages from the webhook.
- `serverless.yaml`: 
- `README.md`: Provides a comprehensive guide on setting up and using the webhook.