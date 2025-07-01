// Types for HyperFeeds API trending content responses

export interface TwitterTrend {
	context: string;
	time: string;
	timePeriod: string;
	trend: string;
	volume: string;
}

export interface RedditTrend {
	author: string;
	created_utc: string;
	id: string;
	is_self: boolean;
	num_comments: number;
	permalink: string;
	score: number;
	selftext: string | null;
	subreddit: string;
	thumbnailImageDescription?: string;
	thumbnailUrl?: string;
	title: string;
	url: string;
}

// biome-ignore lint/suspicious/noExplicitAny: Generic type with default any for flexibility
export interface NetworkData<T = any> {
	count: number;
	source: string;
	trends: T[];
}

export interface TrendingResponse {
	success: boolean;
	data: {
		twitter?: NetworkData<TwitterTrend>;
		reddit?: NetworkData<RedditTrend>;
		// biome-ignore lint/suspicious/noExplicitAny: Index signature for dynamic network data
		[key: string]: NetworkData<any> | undefined;
	};
	message?: string;
}
