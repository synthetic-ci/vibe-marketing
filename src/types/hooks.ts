// Types for the social media hooks YAML structure
export interface HookData {
	networks: Record<
		string,
		{
			name: string;
			categories: Record<
				string,
				{
					name: string;
					hooks: string[];
				}
			>;
		}
	>;
	categories: {
		global: Record<
			string,
			{
				description: string;
				keywords: string[];
			}
		>;
	};
	usage_tips: Record<string, string>;
}

// Type for individual hook search results
export interface HookResult {
	network: string;
	category: string;
	hook: string;
}
