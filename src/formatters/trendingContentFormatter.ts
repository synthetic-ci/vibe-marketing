import type {
	RedditTrend,
	TrendingResponse,
	TwitterTrend,
} from "../types/trending.js";

export class TrendingContentFormatter {
	/**
	 * Format Twitter trends for display
	 */
	private formatTwitterTrends(trends: TwitterTrend[]): string {
		return trends
			.map((trend, index) => {
				let formatted = `**${index + 1}. ${trend.trend}**\n`;
				if (trend.context) {
					formatted += `*${trend.context}*\n`;
				}
				if (trend.volume) {
					formatted += `Volume: ${trend.volume}\n`;
				}
				if (trend.time) {
					const timeFormatted = new Date(trend.time).toLocaleString();
					formatted += `Time: ${timeFormatted}\n`;
				}
				return `${formatted}\n`;
			})
			.join("");
	}

	/**
	 * Format Reddit trends for display
	 */
	private formatRedditTrends(trends: RedditTrend[]): string {
		return trends
			.map((trend, index) => {
				let formatted = `**${index + 1}. ${trend.title}**\n`;
				formatted += `📍 r/${trend.subreddit} • by u/${trend.author}\n`;
				formatted += `⬆️ ${trend.score.toLocaleString()} upvotes • 💬 ${trend.num_comments.toLocaleString()} comments\n`;
				if (trend.selftext?.trim()) {
					formatted += `📝 ${trend.selftext}\n`;
				}
				formatted += `🔗 [View Post](${trend.permalink})\n`;
				const timeFormatted = new Date(trend.created_utc).toLocaleString();
				formatted += `⏰ ${timeFormatted}\n`;
				return `${formatted}\n`;
			})
			.join("");
	}

	/**
	 * Format trending content response for display
	 */
	formatTrendingResponse(data: TrendingResponse): string {
		let responseText = `## Trending Content\n\n`;

		if (data?.success && data?.data) {
			// Iterate through each network in the response
			Object.entries(data.data).forEach(([networkName, networkData]) => {
				if (!networkData) return;

				responseText += `### ${networkData.source || networkName} (${networkData.count || 0} trends)\n\n`;

				if (networkData.trends && Array.isArray(networkData.trends)) {
					// Format based on network type
					switch (networkName.toLowerCase()) {
						case "twitter":
							responseText += this.formatTwitterTrends(
								networkData.trends as TwitterTrend[],
							);
							break;
						case "reddit":
							responseText += this.formatRedditTrends(
								networkData.trends as RedditTrend[],
							);
							break;
						default:
							// Generic formatting for unknown networks
							networkData.trends.forEach((trend: string, index: number) => {
								responseText += `**${index + 1}.** ${JSON.stringify(trend, null, 2)}\n\n`;
							});
					}
				} else {
					responseText += "No trends found for this network.\n\n";
				}
			});
		} else if (data && !data.success) {
			responseText += `API Error: ${data.message || "Unknown error from the HyperFeed API"}`;
		} else {
			responseText += `Unexpected response format: ${JSON.stringify(data, null, 2)}`;
		}

		return responseText;
	}
}
