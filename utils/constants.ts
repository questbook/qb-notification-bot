import { NotificationType } from "../src/generated/graphql"

const subgraphURLS = {
    5: 'https://api-grants.questbook.app/graphql',
    10: 'https://api-grants.questbook.app/graphql',
}

const offchainSubgraphURLS = 'https://api-grants.questbook.app/graphql'

const permittedNotificationTypes = [NotificationType.ApplicationSubmitted, NotificationType.ApplicationAccepted, NotificationType.ApplicationRejected, NotificationType.ApplicationResubmitted, NotificationType.ApplicationReview, NotificationType.CommentAdded, NotificationType.FundsDisbursedFromSafe, NotificationType.ReviewSubmitted]

export { subgraphURLS, permittedNotificationTypes, offchainSubgraphURLS }