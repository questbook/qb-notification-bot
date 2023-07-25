import fetch from 'cross-fetch'

const IPFS_DOWNLOAD_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/cat'

export const getFromIPFS = async(hash: string): Promise<string> => {
	if(hash === '') {
		return ''
	}

	// const cached = localStorage.getItem(hash)
	// if(cached !== null) {
	// 	return cached
	// }

	try {
		// console.log(hash)
		const fetchResult = await fetch(`https://qbnotifications.infura-ipfs.io/ipfs/${hash}`)
		const text = await fetchResult.text()

		return text
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		console.log('error fetching from ipfs 1 ',e)
	}

	// fallback
	try {
		// console.log(hash)
		const fetchResult = await fetch(`https://ipfs.io/ipfs/${hash}`)
		const text = await fetchResult.text()

		return text

	} catch(e: any) {
		console.log('error fetching from ipfs 2',e)
	}

	return ''
}