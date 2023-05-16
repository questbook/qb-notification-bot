const IPFS_DOWNLOAD_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/cat'

export const getFromIPFS = async(hash: string): Promise<string> => {
	if(hash === '' || typeof window === 'undefined') {
		return ''
	}

	const cached = localStorage.getItem(hash)
	if(cached !== null) {
		return cached
	}

	try {
		// console.log(hash)
		const fetchResult = await fetch(`${IPFS_DOWNLOAD_ENDPOINT}?arg=${hash}`)
		const text = await fetchResult.text()
		localStorage.setItem(hash, text)
		return text
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		// console.log(e)
	}

	// fallback
	try {
		// console.log(hash)
		const fetchResult = await fetch(`https://ipfs.io/ipfs/${hash}`)
		const text = await fetchResult.text()
		localStorage.setItem(hash, text)
		return text
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		// console.log(e)
	}

	return ''
}