import { GetEntityQuery, GetNotificationsQuery } from "../src/generated/graphql";
import { getDashboardLink } from "./getDashboardLink";

const sanitizeString = (str: string): string => {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const getMessage = async (type: 'app' | 'gp', chain: string, entityInfo: GetEntityQuery, notification: GetNotificationsQuery['notifications'][number]): Promise<string> => {
    switch (notification.type) {
        case 'application_submitted':
            if (type === 'app') return ''
            else {
                if (entityInfo.grantApplication?.version === 1) {
                    return `A new proposal received for grant program <b>${sanitizeString(entityInfo.grant?.title)}</b>. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain)}\">Dashboard</a> to view the update`
                } else {
                    return `Propsal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> was resubmitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b>. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to view the update.`
                }
            }

        case 'application_accepted':
            return `The proposal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> submitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b> has been accepted. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to view the update.`

        case 'application_rejected':
            return `The proposal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> submitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b> was rejected. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to see the reason.`

        case 'application_resubmitted':
            return `The proposal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> submitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b> was asked to resubmitted. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to view the update.`

        case 'comment_added':
            const comment = entityInfo.comments?.find((comment) => comment?.application?.id === entityInfo?.grantApplication?.id && comment?.grant?.id === entityInfo?.grant?.id)
            if (comment?.isPrivate) {
                return `A new private comment was received to proposal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> submitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b>. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to view the comment.`
            } else {
                try {
                    const ipfsData = comment?.commentsPublicHash
                    //@ts-ignore
                    const message = ipfsData?.message 
                    return `A new comment, "${sanitizeString(message)}", was received to proposal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> submitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b>. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to view the comment.`
                }
                catch (e) {
                    console.log("Error getting from ipfs")
                    return `A new comment was received to proposal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> submitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b>. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to view the comment.`
                }
            }

        case 'funds_disbursed_from_safe':
            if (notification.title.includes('executed')) {
                return `Funds have been sent to builder for proposal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> submitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b>. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to see more details.`
            } else {
                return `Payout has been initiated to builder for proposal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> submitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b>. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to see more details.`
            }

        case 'review_submitted':
            return `Review submitted for proposal with title <b>${sanitizeString(entityInfo.grantApplication?.title?.[0]?.values?.[0]?.value)}</b> submitted to grant program <b>${sanitizeString(entityInfo.grant?.title)}</b>. Visit <a href=\"${getDashboardLink(entityInfo.grant?.id, chain, entityInfo?.grantApplication?.id)}\">Dashboard</a> to view the submitted review.`

        default:
            return ''
    }
}

export { getMessage }