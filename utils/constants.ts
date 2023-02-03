import { NotificationType } from "../src/generated/graphql"

const subgraphURLS = {
    5: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-goerli-testnet',
    10: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-optimism-mainnet',
    137: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-polygon-mainnet',
    42220: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-celo-mainnet',
}

const permittedNotificationTypes = [NotificationType.ApplicationSubmitted, NotificationType.ApplicationAccepted, NotificationType.ApplicationRejected, NotificationType.ApplicationResubmitted, NotificationType.CommentAdded, NotificationType.FundsDisbursedFromSafe, NotificationType.ReviewSubmitted]

export { subgraphURLS, permittedNotificationTypes }