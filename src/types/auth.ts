export interface TokenSet {
	accessToken: string;
	accessTokenTTL: number;
	idToken: string;
	refreshToken: string;
}

export interface UserProps extends Record<string, unknown> {
	claims: Record<string, any>;
	tokenSet: TokenSet;
}

export interface ClerkAuthRequest {
	mcpAuthRequest: import("@cloudflare/workers-oauth-provider").AuthRequest;
	transactionState: string;
	consentToken: string;
	codeVerifier?: string;
}
