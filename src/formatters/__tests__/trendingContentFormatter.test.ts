import { beforeEach, describe, it, expect as vitestExpected } from "vitest";

// biome-ignore lint: any type is needed for test compatibility
const expect = vitestExpected as any;

import type {
	RedditTrend,
	TrendingResponse,
	TwitterTrend,
} from "../../types/trending.js";
import { TrendingContentFormatter } from "../trendingContentFormatter.js";

describe("TrendingContentFormatter", () => {
	let formatter: TrendingContentFormatter;

	beforeEach(() => {
		formatter = new TrendingContentFormatter();
	});

	describe("formatTrendingResponse", () => {
		it("should format successful Twitter trends correctly", () => {
			const mockTwitterTrends: TwitterTrend[] = [
				{
					trend: "#JavaScript",
					context: "Programming languages",
					volume: "125K",
					time: "2024-01-15T10:30:00Z",
					timePeriod: "24h",
				},
				{
					trend: "React 18",
					context: "Web frameworks",
					volume: "89K",
					time: "2024-01-15T09:15:00Z",
					timePeriod: "12h",
				},
			];

			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					twitter: {
						count: 2,
						source: "Twitter API",
						trends: mockTwitterTrends,
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("## Trending Content");
			expect(result).toContain("### Twitter API (2 trends)");
			expect(result).toContain("**1. #JavaScript**");
			expect(result).toContain("*Programming languages*");
			expect(result).toContain("Volume: 125K");
			expect(result).toContain("**2. React 18**");
			expect(result).toContain("*Web frameworks*");
			expect(result).toContain("Volume: 89K");
		});

		it("should format successful Reddit trends correctly", () => {
			const mockRedditTrends: RedditTrend[] = [
				{
					title: "Amazing new discovery in space",
					author: "scientist123",
					subreddit: "space",
					score: 15420,
					num_comments: 789,
					selftext:
						"Scientists have discovered something incredible in the Andromeda galaxy...",
					permalink:
						"https://reddit.com/r/space/comments/abc123/amazing-discovery",
					created_utc: "2024-01-15T10:30:00Z",
					id: "abc123",
					is_self: true,
					url: "https://reddit.com/r/space/comments/abc123/amazing-discovery",
				},
				{
					title: "Breaking: Major tech announcement",
					author: "techreporter",
					subreddit: "technology",
					score: 8950,
					num_comments: 456,
					selftext: null,
					permalink:
						"https://reddit.com/r/technology/comments/def456/breaking-tech",
					created_utc: "2024-01-15T09:15:00Z",
					id: "def456",
					is_self: false,
					url: "https://techcrunch.com/article/major-announcement",
				},
			];

			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					reddit: {
						count: 2,
						source: "Reddit API",
						trends: mockRedditTrends,
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("## Trending Content");
			expect(result).toContain("### Reddit API (2 trends)");
			expect(result).toContain("**1. Amazing new discovery in space**");
			expect(result).toContain("📍 r/space • by u/scientist123");
			expect(result).toContain("⬆️ 15,420 upvotes • 💬 789 comments");
			expect(result).toContain(
				"📝 Scientists have discovered something incredible",
			);
			expect(result).toContain(
				"🔗 [View Post](https://reddit.com/r/space/comments/abc123/amazing-discovery)",
			);

			expect(result).toContain("**2. Breaking: Major tech announcement**");
			expect(result).toContain("📍 r/technology • by u/techreporter");
			expect(result).toContain("⬆️ 8,950 upvotes • 💬 456 comments");
			expect(result).toContain(
				"🔗 [View Post](https://reddit.com/r/technology/comments/def456/breaking-tech)",
			);
		});

		it("should format both Twitter and Reddit trends together", () => {
			const mockTwitterTrends: TwitterTrend[] = [
				{
					trend: "AI Revolution",
					context: "Technology",
					volume: "200K",
					time: "2024-01-15T10:30:00Z",
					timePeriod: "24h",
				},
			];

			const mockRedditTrends: RedditTrend[] = [
				{
					title: "AI breakthrough discussion",
					author: "aiexpert",
					subreddit: "artificial",
					score: 5000,
					num_comments: 250,
					selftext: "Let's discuss the latest AI developments",
					permalink:
						"https://reddit.com/r/artificial/comments/xyz789/ai-breakthrough",
					created_utc: "2024-01-15T10:00:00Z",
					id: "xyz789",
					is_self: true,
					url: "https://reddit.com/r/artificial/comments/xyz789/ai-breakthrough",
				},
			];

			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					twitter: {
						count: 1,
						source: "Twitter",
						trends: mockTwitterTrends,
					},
					reddit: {
						count: 1,
						source: "Reddit",
						trends: mockRedditTrends,
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("## Trending Content");
			expect(result).toContain("### Twitter (1 trends)");
			expect(result).toContain("**1. AI Revolution**");
			expect(result).toContain("### Reddit (1 trends)");
			expect(result).toContain("**1. AI breakthrough discussion**");
		});

		it("should handle Twitter trends without optional fields", () => {
			const mockTwitterTrends: TwitterTrend[] = [
				{
					trend: "Simple Trend",
					context: "",
					volume: "",
					time: "",
					timePeriod: "24h",
				},
			];

			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					twitter: {
						count: 1,
						source: "Twitter",
						trends: mockTwitterTrends,
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("**1. Simple Trend**");
			expect(result).not.toContain("Volume:");
			expect(result).not.toContain("Time:");
			// Should still contain ** for trend formatting, but not context-specific markdown
			expect(result).not.toContain("*Programming languages*");
		});

		it("should handle Reddit trends without selftext", () => {
			const mockRedditTrends: RedditTrend[] = [
				{
					title: "Link post only",
					author: "linkposter",
					subreddit: "news",
					score: 1000,
					num_comments: 50,
					selftext: null,
					permalink: "https://reddit.com/r/news/comments/link123/link-post",
					created_utc: "2024-01-15T10:30:00Z",
					id: "link123",
					is_self: false,
					url: "https://example.com/news-article",
				},
			];

			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					reddit: {
						count: 1,
						source: "Reddit",
						trends: mockRedditTrends,
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("**1. Link post only**");
			expect(result).toContain("📍 r/news • by u/linkposter");
			expect(result).toContain("⬆️ 1,000 upvotes • 💬 50 comments");
			expect(result).not.toContain("📝"); // No selftext section
			expect(result).toContain(
				"🔗 [View Post](https://reddit.com/r/news/comments/link123/link-post)",
			);
		});

		it("should handle Reddit trends with empty selftext", () => {
			const mockRedditTrends: RedditTrend[] = [
				{
					title: "Empty selftext post",
					author: "emptyposter",
					subreddit: "test",
					score: 100,
					num_comments: 10,
					selftext: "   ", // Whitespace only
					permalink: "https://reddit.com/r/test/comments/empty123/empty-post",
					created_utc: "2024-01-15T10:30:00Z",
					id: "empty123",
					is_self: true,
					url: "https://reddit.com/r/test/comments/empty123/empty-post",
				},
			];

			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					reddit: {
						count: 1,
						source: "Reddit",
						trends: mockRedditTrends,
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("**1. Empty selftext post**");
			expect(result).not.toContain("📝"); // No selftext section for whitespace-only content
		});

		it("should handle unknown network types with generic formatting", () => {
			const mockGenericTrends = ["Generic trend 1", "Generic trend 2"];

			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					unknown_network: {
						count: 2,
						source: "Unknown API",
						trends: mockGenericTrends,
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("## Trending Content");
			expect(result).toContain("### Unknown API (2 trends)");
			expect(result).toContain('**1.** "Generic trend 1"');
			expect(result).toContain('**2.** "Generic trend 2"');
		});

		it("should handle empty trends array", () => {
			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					twitter: {
						count: 0,
						source: "Twitter",
						trends: [],
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("## Trending Content");
			expect(result).toContain("### Twitter (0 trends)");
			// When trends array is empty, no special message is added - just empty content
			expect(result).not.toContain("No trends found for this network.");
		});

		it("should handle API error responses", () => {
			const mockResponse: TrendingResponse = {
				success: false,
				data: {},
				message: "API rate limit exceeded",
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("## Trending Content");
			expect(result).toContain("API Error: API rate limit exceeded");
		});

		it("should handle API error responses without message", () => {
			const mockResponse: TrendingResponse = {
				success: false,
				data: {},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("## Trending Content");
			expect(result).toContain(
				"API Error: Unknown error from the HyperFeed API",
			);
		});

		it("should handle unexpected response format", () => {
			// biome-ignore lint/suspicious/noExplicitAny: Testing unexpected response format
			const mockResponse = {
				unexpected: "format",
			} as any;

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("## Trending Content");
			// When response doesn't have success property, it's treated as unsuccessful
			expect(result).toContain(
				"API Error: Unknown error from the HyperFeed API",
			);
		});

		it("should handle missing data property", () => {
			const mockResponse: TrendingResponse = {
				success: true,
				// biome-ignore lint/suspicious/noExplicitAny: Testing missing data property
				data: null as any,
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("## Trending Content");
			// Should not crash and handle gracefully
		});

		it("should format time correctly for different platforms", () => {
			const mockTwitterTrends: TwitterTrend[] = [
				{
					trend: "Time Test",
					context: "Testing",
					volume: "1K",
					time: "2024-01-15T10:30:00.000Z",
					timePeriod: "1h",
				},
			];

			const mockRedditTrends: RedditTrend[] = [
				{
					title: "Time test post",
					author: "timetest",
					subreddit: "test",
					score: 100,
					num_comments: 5,
					selftext: "Testing time formatting",
					permalink: "https://reddit.com/r/test/comments/time123/time-test",
					created_utc: "2024-01-15T10:30:00.000Z",
					id: "time123",
					is_self: true,
					url: "https://reddit.com/r/test/comments/time123/time-test",
				},
			];

			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					twitter: {
						count: 1,
						source: "Twitter",
						trends: mockTwitterTrends,
					},
					reddit: {
						count: 1,
						source: "Reddit",
						trends: mockRedditTrends,
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			// Both should format the same timestamp
			expect(result).toContain("Time:");
			expect(result).toContain("⏰");
		});

		it("should handle large numbers in Reddit scores and comments", () => {
			const mockRedditTrends: RedditTrend[] = [
				{
					title: "Viral post",
					author: "viraluser",
					subreddit: "popular",
					score: 125432,
					num_comments: 9876,
					selftext: "This went viral!",
					permalink:
						"https://reddit.com/r/popular/comments/viral123/viral-post",
					created_utc: "2024-01-15T10:30:00Z",
					id: "viral123",
					is_self: true,
					url: "https://reddit.com/r/popular/comments/viral123/viral-post",
				},
			];

			const mockResponse: TrendingResponse = {
				success: true,
				data: {
					reddit: {
						count: 1,
						source: "Reddit",
						trends: mockRedditTrends,
					},
				},
			};

			const result = formatter.formatTrendingResponse(mockResponse);

			expect(result).toContain("⬆️ 125,432 upvotes • 💬 9,876 comments");
		});
	});
});
