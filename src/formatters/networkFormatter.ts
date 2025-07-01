export class NetworkFormatter {
	/**
	 * Format network categories for display with category names and hook counts
	 */
	formatNetworkCategories(
		networkName: string,
		categories: Array<{ key: string; name: string; hookCount: number }>,
	): string {
		const responseText =
			`## Categories for ${networkName}\n\n` +
			`Found ${categories.length} categories:\n\n` +
			categories
				.map(
					(cat) =>
						`• **${cat.name}** (${cat.key})\n  ${cat.hookCount} hooks available`,
				)
				.join("\n\n");

		return responseText;
	}
}
