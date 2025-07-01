/**
 * Validates a HyperFeed API key by making a request to the validation endpoint
 * @param token The API key to validate
 * @returns Promise<boolean> indicating if the key is valid
 */
export async function validateHyperFeedApiKey(token: string): Promise<boolean> {
	try {
		console.log('Validating API key...');
		const response = await fetch('https://app.hyperfeed.ai/api/validate-key', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		
		if (response.ok) {
			console.log('HyperFeed API key validation successful');
			return true;
		} else {
			console.error('HyperFeed API key validation failed:', response.status, response.statusText);
			return false;
		}
	} catch (error) {
		console.error('HyperFeed API key validation error:', error);
		return false;
	}
} 