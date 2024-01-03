import { NotificationType } from "../src/generated/graphql"

const subgraphURLS = {
    5: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-goerli-testnet',
    10: 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-optimism-mainnet',
}

const offchainSubgraphURLS = 'https://api-grants.questbook.app'

const permittedNotificationTypes = [NotificationType.ApplicationSubmitted, NotificationType.ApplicationAccepted, NotificationType.ApplicationRejected, NotificationType.ApplicationResubmitted, NotificationType.CommentAdded, NotificationType.FundsDisbursedFromSafe, NotificationType.ReviewSubmitted]

export { subgraphURLS, permittedNotificationTypes, offchainSubgraphURLS }