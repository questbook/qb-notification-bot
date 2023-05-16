# Questbook Telegram Notification Bot

Welcome to the repository for our [Questbook Telegram Bot](https://t.me/qb_notif_bot) webhook, an efficient and scalable solution that manages new subscription requests and periodically sends out messages to subscribed users. This webhook is designed using the pub-sub architecture.

This Telegram bot enables users to subscribe or unsubscribe from grant program updates, allowing them to receive periodic messages containing relevant. Leveraging the pub-sub pattern, the bot is capable of managing a high volume of subscription requests and messages, all while maintaining a responsive user experience.

## Repository Structure

- `src/generated/graphql.ts`: Contains the source code for the webhook.
- `graphql/`: Contains configuration files for setting up the webhook and API credentials.
  - `getNotifications.graphql`: 
  - `getEntity.graphql`: 
- `utils/`: Contains unit tests for ensuring the reliability and accuracy of the code.
  - `addNewSubscription.ts`:
  - `constants.ts`: 
  - `getDashboardLink.ts`: 
  - `getMessage.ts`: 
  - `sendNotifications.ts`: 
  - `sleep.ts`: 
- `codegen.ts`: 
- `index.ts`: 
- `serverless.yaml`: 
- `README.md`: Provides a comprehensive guide on setting up and using the webhook.

## Getting Started

To set up the webhook and start using it, please follow the instructions provided in the `README.md` file. This will guide you through the installation of required dependencies, configuration of the webhook, and deployment of the bot.

We hope you find this Telegram bot webhook useful and efficient for managing subscriptions and sending periodic messages to users. If you encounter any issues or have suggestions for improvements, feel free to create an issue or submit a pull request. Happy messaging!