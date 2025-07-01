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


