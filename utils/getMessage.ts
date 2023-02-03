import { GetEntityQuery, GetNotificationsQuery } from "../src/generated/graphql";
import { getDashboardLink } from "./getDashboardLink";

const getMessage = (type: 'app' | 'gp', chain: string, entityInfo: GetEntityQuery, notification: GetNotificationsQuery['notifications'][number]): string => {
    switch(notification.type) {
        case 'application_submitted':
            if (type === 'app') return ''
            else return `A new proposal received for grant program <b>${entityInfo.grant?.title}</b>. Visit ${getDashboardLink(entityInfo.grant?.id, chain)} to view the update`

        case 'application_accepted':
            return `The proposal with title <b>${entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value}</b> submitted to grant program <b>${entityInfo.grant?.title}</b> has been accepted. Visit ${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)} to view the update.`
        
        case 'application_rejected':
            return `The proposal with title <b>${entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value}</b> submitted to grant program <b>${entityInfo.grant?.title}</b> was rejected. Visit ${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)} to see the reason.`

        case 'application_resubmitted':
            return `The proposal with title <b>${entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value}</b> submitted to grant program <b>${entityInfo.grant?.title}</b> was asked to resubmitted. Visit ${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)} to view the update.`

        case 'comment_added':
            return `A new comment was received to proposal with title <b>${entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value}</b> submitted to grant program <b>${entityInfo.grant?.title}</b>. Visit ${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)} to view the comment.`

        case 'funds_disbursed_from_safe':
            if (notification.title.includes('executed')) {
                return `Funds have been sent to builder for proposal with title <b>${entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value}</b> submitted to grant program <b>${entityInfo.grant?.title}</b>. Visit ${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)} to see more details.`
            } else {
                return `Payout has been initiated to builder for proposal with title <b>${entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value}</b> submitted to grant program <b>${entityInfo.grant?.title}</b>. Visit ${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)} to see more details.`
            }

        case 'review_submitted':
            return `Review submitted for proposal with title <b>${entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value}</b> submitted to grant program <b>${entityInfo.grant?.title}</b>. Visit ${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)} to view the submitted review.`

        default:
            return ''
    }
}

export { getMessage }