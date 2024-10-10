// todo: replace this with db query 
const grants = [
    {
      name: 'starknet',
      grants: ['661667585afea0acb56c9f08'],
    },
    {
        name: 'ens',
        grants: ['6619151a3a7a91313846ed80']
    },
    {
       name: 'axelar',
       grants: ['661e3ce1f056dd981db4e795','661e3cc3f056dd981db4e6a6','65fad2b01080cbb344dbbf24','661e3c82f056dd981db4e293','661e3bf5ccf6446509d2b308','669778c4e1827e9ac9693bf5','661e3ca0f056dd981db4e4a5']
    }
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