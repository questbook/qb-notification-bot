const grants = [
    {
      name: 'starknet',
      grants: ['661667585afea0acb56c9f08'],
    },
    {
        name: 'ens',
        grants: ['6619151a3a7a91313846ed80']
    },
];

const getDashboardLink = (grant: string, chain: string, appId?: string): string => {
    for (const id of grants) {
        if (id.grants.includes(grant)) {
          return `https://${id.name}.questbook.app/dashboard?grantId=${grant}&chainId=${chain}${appId !== undefined ? `&proposalId=${appId}` : ''}`;
        }
    }
    return `https://${chain === '5' ? 'beta.' : ''}questbook.app/dashboard?grantId=${grant}&chainId=${chain}${appId !== undefined ? `&proposalId=${appId}` : ''}`;
}

export { getDashboardLink }