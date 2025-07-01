import { beforeEach, describe, it, expect as vitestExpected } from "vitest";

// biome-ignore lint: any type is needed for test compatibility
const expect = vitestExpected as any;

import { NetworkFormatter } from "../networkFormatter.js";

describe("NetworkFormatter", () => {
	let formatter: NetworkFormatter;

	beforeEach(() => {
		formatter = new NetworkFormatter();
	});

	describe("formatNetworkCategories", () => {
		it("should format network categories correctly", () => {
			const mockCategories = [
				{ key: "engagement", name: "Engagement Hooks", hookCount: 15 },
				{ key: "educational", name: "Educational Content", hookCount: 8 },
				{ key: "promotional", name: "Promotional Posts", hookCount: 12 },
			];

			const result = formatter.formatNetworkCategories(
				"Twitter/X",
				mockCategories,
			);

			expect(result).toContain("## Categories for Twitter/X");
			expect(result).toContain("Found 3 categories:");
			expect(result).toContain(
				"• **Engagement Hooks** (engagement)\n  15 hooks available",
			);
			expect(result).toContain(
				"• **Educational Content** (educational)\n  8 hooks available",
			);
			expect(result).toContain(
				"• **Promotional Posts** (promotional)\n  12 hooks available",
			);
		});

		it("should handle single category", () => {
			const mockCategories = [
				{ key: "general", name: "General Content", hookCount: 5 },
			];

			const result = formatter.formatNetworkCategories(
				"Instagram",
				mockCategories,
			);

			expect(result).toContain("## Categories for Instagram");
			expect(result).toContain("Found 1 categories:");
			expect(result).toContain(
				"• **General Content** (general)\n  5 hooks available",
			);
		});

		it("should handle empty categories array", () => {
			const mockCategories: Array<{
				key: string;
				name: string;
				hookCount: number;
			}> = [];

			const result = formatter.formatNetworkCategories(
				"LinkedIn",
				mockCategories,
			);

			expect(result).toContain("## Categories for LinkedIn");
			expect(result).toContain("Found 0 categories:");
			// Should not contain any bullet points
			expect(result).not.toContain("•");
		});

		it("should handle categories with zero hooks", () => {
			const mockCategories = [
				{ key: "empty", name: "Empty Category", hookCount: 0 },
				{ key: "populated", name: "Populated Category", hookCount: 10 },
			];

			const result = formatter.formatNetworkCategories(
				"TikTok",
				mockCategories,
			);

			expect(result).toContain("## Categories for TikTok");
			expect(result).toContain("Found 2 categories:");
			expect(result).toContain(
				"• **Empty Category** (empty)\n  0 hooks available",
			);
			expect(result).toContain(
				"• **Populated Category** (populated)\n  10 hooks available",
			);
		});

		it("should handle special characters in network name", () => {
			const mockCategories = [
				{ key: "test", name: "Test Category", hookCount: 1 },
			];

			const result = formatter.formatNetworkCategories(
				"Custom & Special Network",
				mockCategories,
			);

			expect(result).toContain("## Categories for Custom & Special Network");
			expect(result).toContain("Found 1 categories:");
			expect(result).toContain(
				"• **Test Category** (test)\n  1 hooks available",
			);
		});

		it("should handle special characters in category names and keys", () => {
			const mockCategories = [
				{ key: "q&a", name: "Q&A Sessions", hookCount: 7 },
				{ key: "how-to", name: "How-To Guides", hookCount: 15 },
				{ key: "behind_scenes", name: "Behind the Scenes", hookCount: 3 },
			];

			const result = formatter.formatNetworkCategories(
				"YouTube",
				mockCategories,
			);

			expect(result).toContain("## Categories for YouTube");
			expect(result).toContain("Found 3 categories:");
			expect(result).toContain("• **Q&A Sessions** (q&a)\n  7 hooks available");
			expect(result).toContain(
				"• **How-To Guides** (how-to)\n  15 hooks available",
			);
			expect(result).toContain(
				"• **Behind the Scenes** (behind_scenes)\n  3 hooks available",
			);
		});

		it("should handle large hook counts with proper formatting", () => {
			const mockCategories = [
				{ key: "viral", name: "Viral Content", hookCount: 1000 },
				{ key: "trending", name: "Trending Topics", hookCount: 2500 },
			];

			const result = formatter.formatNetworkCategories(
				"Platform X",
				mockCategories,
			);

			expect(result).toContain("## Categories for Platform X");
			expect(result).toContain("Found 2 categories:");
			expect(result).toContain(
				"• **Viral Content** (viral)\n  1000 hooks available",
			);
			expect(result).toContain(
				"• **Trending Topics** (trending)\n  2500 hooks available",
			);
		});

		it("should maintain proper spacing and formatting structure", () => {
			const mockCategories = [
				{ key: "cat1", name: "Category One", hookCount: 5 },
				{ key: "cat2", name: "Category Two", hookCount: 10 },
			];

			const result = formatter.formatNetworkCategories(
				"Test Network",
				mockCategories,
			);

			// Check for proper spacing between categories
			const lines = result.split("\n");
			expect(lines).toContain("Found 2 categories:");
			expect(lines).toContain(""); // Empty line after "Found X categories:"

			// Should have proper bullet point formatting
			expect(result).toMatch(
				/• \*\*Category One\*\* \(cat1\)\n {2}5 hooks available\n\n• \*\*Category Two\*\* \(cat2\)\n {2}10 hooks available/,
			);
		});
	});
});
