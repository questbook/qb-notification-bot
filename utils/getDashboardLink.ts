const getDashboardLink = (grant: string, chain: string, appId?: string): string => {
    return `https://${chain === '5' ? 'beta.' : ''}questbook.app/dashboard?grantId=${grant}&chain=${chain}&proposalId=${appId}`;
}

export { getDashboardLink }