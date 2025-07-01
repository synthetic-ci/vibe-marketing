import { beforeEach, describe, it, expect as vitestExpect } from "vitest";

// biome-ignore lint: any type is needed for test compatibility
const expect = vitestExpect as any;

import type { HookData } from "../../types/hooks.js";
import { HookSearchService, type SearchFilters } from "../hookSearchService.js";

// Mock data for testing
const mockHooksData: HookData = {
	networks: {
		twitter: {
			name: "Twitter/X",
			categories: {
				engagement: {
					name: "Engagement Hooks",
					hooks: [
						"What's your hot take on [topic]?",
						"Unpopular opinion: [controversial statement]",
						"This or that: [option A] vs [option B]?",
					],
				},
				educational: {
					name: "Educational Content",
					hooks: [
						"🧵 Thread: Everything you need to know about [topic]",
						"5 things I wish I knew about [topic] when I started",
					],
				},
			},
		},
		instagram: {
			name: "Instagram",
			categories: {
				engagement: {
					name: "Engagement Hooks",
					hooks: [
						"Double tap if you agree with this...",
						"Comment your favorite [category] below 👇",
					],
				},
				lifestyle: {
					name: "Lifestyle Content",
					hooks: [
						"A day in my life as a [profession/role]",
						"Get ready with me for [event/situation]",
					],
				},
			},
		},
		linkedin: {
			name: "LinkedIn",
			categories: {
				professional: {
					name: "Professional Insights",
					hooks: [
						"After [number] years in [industry], here's what I've learned:",
						"The career advice I wish someone gave me earlier:",
					],
				},
			},
		},
	},
	categories: {
		global: {
			engagement: {
				description: "Content designed to increase interaction",
				keywords: ["engagement", "interaction", "community"],
			},
		},
	},
	usage_tips: {
		tip1: "Always customize hooks for your specific audience",
		tip2: "Test different variations to see what works best",
	},
};

describe("HookSearchService", () => {
	let hookSearchService: HookSearchService;

	beforeEach(() => {
		hookSearchService = new HookSearchService(mockHooksData);
	});

	describe("searchHooks", () => {
		it("should return all hooks when no filters are provided", () => {
			const results = hookSearchService.searchHooks({});

			expect(results).toHaveLength(10); // Total hooks in mock data: 3+2+2+2+2 = 10
			expect(results[0]).toHaveProperty("network");
			expect(results[0]).toHaveProperty("category");
			expect(results[0]).toHaveProperty("hook");
		});

		it("should filter hooks by network only", () => {
			const filters: SearchFilters = { network: "twitter" };
			const results = hookSearchService.searchHooks(filters);

			expect(results).toHaveLength(5); // 3 engagement + 2 educational
			expect(results.every((result) => result.network === "Twitter/X")).toBe(
				true,
			);
		});

		it("should filter hooks by category only", () => {
			const filters: SearchFilters = { category: "engagement" };
			const results = hookSearchService.searchHooks(filters);

			expect(results).toHaveLength(5); // 3 from twitter + 2 from instagram
			expect(
				results.every((result) => result.category === "Engagement Hooks"),
			).toBe(true);
		});

		it("should filter hooks by both network and category", () => {
			const filters: SearchFilters = {
				network: "twitter",
				category: "engagement",
			};
			const results = hookSearchService.searchHooks(filters);

			expect(results).toHaveLength(3);
			expect(
				results.every(
					(result) =>
						result.network === "Twitter/X" &&
						result.category === "Engagement Hooks",
				),
			).toBe(true);
		});

		it("should respect the limit parameter", () => {
			const filters: SearchFilters = { limit: 3 };
			const results = hookSearchService.searchHooks(filters);

			expect(results).toHaveLength(3);
		});

		it("should return all hooks for non-existent network (fallback behavior)", () => {
			const filters: SearchFilters = { network: "nonexistent" };
			const results = hookSearchService.searchHooks(filters);

			// When network doesn't exist, it falls back to returning all hooks
			expect(results).toHaveLength(10);
		});

		it("should return empty array for non-existent category", () => {
			const filters: SearchFilters = { category: "nonexistent" };
			const results = hookSearchService.searchHooks(filters);

			expect(results).toHaveLength(0);
		});

		it("should return all network hooks when category does not exist (fallback behavior)", () => {
			const filters: SearchFilters = {
				network: "twitter",
				category: "nonexistent",
			};
			const results = hookSearchService.searchHooks(filters);

			// When category doesn't exist, it falls back to returning all hooks for the network
			expect(results).toHaveLength(5); // All twitter hooks
			expect(results.every((result) => result.network === "Twitter/X")).toBe(
				true,
			);
		});

		it("should handle limit larger than available results", () => {
			const filters: SearchFilters = { network: "linkedin", limit: 100 };
			const results = hookSearchService.searchHooks(filters);

			expect(results).toHaveLength(2); // Only 2 hooks in linkedin
		});

		it("should handle zero limit", () => {
			const filters: SearchFilters = { limit: 0 };
			const results = hookSearchService.searchHooks(filters);

			expect(results).toHaveLength(0);
		});

		it("should maintain correct data structure in results", () => {
			const filters: SearchFilters = {
				network: "twitter",
				category: "engagement",
				limit: 1,
			};
			const results = hookSearchService.searchHooks(filters);

			expect(results).toHaveLength(1);
			expect(results[0]).toHaveProperty("network", "Twitter/X");
			expect(results[0]).toHaveProperty("category", "Engagement Hooks");
			expect(results[0]).toHaveProperty("hook");
			expect(typeof results[0].hook).toBe("string");

			// Verify the hook is one of the expected ones from the engagement category
			const expectedHooks = [
				"What's your hot take on [topic]?",
				"Unpopular opinion: [controversial statement]",
				"This or that: [option A] vs [option B]?",
			];
			expect(expectedHooks).toContain(results[0].hook);
		});

		it("should handle case-sensitive network names", () => {
			const filters: SearchFilters = { network: "Twitter" }; // Different case
			const results = hookSearchService.searchHooks(filters);

			// Should fallback to all hooks since 'Twitter' !== 'twitter'
			expect(results).toHaveLength(10);
		});

		it("should handle case-sensitive category names", () => {
			const filters: SearchFilters = { category: "Engagement" }; // Different case
			const results = hookSearchService.searchHooks(filters);

			// Should return empty since 'Engagement' !== 'engagement'
			expect(results).toHaveLength(0);
		});

		it("should randomize results when there are more hooks than the limit", () => {
			const filters: SearchFilters = { limit: 3 }; // Less than total of 10 hooks

			// Get multiple results to check for randomization
			const results1 = hookSearchService.searchHooks(filters);
			const results2 = hookSearchService.searchHooks(filters);
			const results3 = hookSearchService.searchHooks(filters);

			// All should have the correct length
			expect(results1).toHaveLength(3);
			expect(results2).toHaveLength(3);
			expect(results3).toHaveLength(3);

			// Convert results to strings for easier comparison
			// biome-ignore lint/suspicious/noExplicitAny: any type is needed for test data comparison
			const stringify = (results: any[]) =>
				results.map((r) => `${r.network}-${r.category}-${r.hook}`).join("|");
			const str1 = stringify(results1);
			const str2 = stringify(results2);
			const str3 = stringify(results3);

			// At least one should be different (very high probability with randomization)
			// We check multiple combinations to reduce flakiness
			const allSame = str1 === str2 && str2 === str3;
			expect(allSame).toBe(false);
		});

		it("should not randomize when results count equals limit", () => {
			// Use a specific network with known number of hooks
			const filters: SearchFilters = { network: "linkedin", limit: 2 }; // Exactly 2 hooks in linkedin

			const results1 = hookSearchService.searchHooks(filters);
			const results2 = hookSearchService.searchHooks(filters);

			expect(results1).toHaveLength(2);
			expect(results2).toHaveLength(2);

			// Results should be the same since no randomization occurs when count equals limit
			expect(results1).toEqual(results2);
		});
	});

	describe("formatResults", () => {
		it("should format results correctly when hooks are found", () => {
			const mockResults = [
				{
					network: "Twitter/X",
					category: "Engagement Hooks",
					hook: "What's your hot take on [topic]?",
				},
				{
					network: "Instagram",
					category: "Lifestyle Content",
					hook: "A day in my life as a [profession/role]",
				},
			];

			const formatted = hookSearchService.formatResults(mockResults);

			expect(formatted).toContain("Found 2 hook(s):");
			expect(formatted).toContain("1. **Twitter/X - Engagement Hooks**");
			expect(formatted).toContain('"What\'s your hot take on [topic]?"');
			expect(formatted).toContain("2. **Instagram - Lifestyle Content**");
			expect(formatted).toContain('"A day in my life as a [profession/role]"');
			expect(formatted).toContain("💡 **Usage Tips:**");
			expect(formatted).toContain(
				"Always customize hooks for your specific audience",
			);
		});

		it("should return appropriate message when no hooks are found", () => {
			const formatted = hookSearchService.formatResults([]);

			expect(formatted).toBe("No hooks found matching your criteria.");
		});

		it("should include usage tips when available", () => {
			const mockResults = [
				{
					network: "Twitter/X",
					category: "Engagement Hooks",
					hook: "Test hook",
				},
			];

			const formatted = hookSearchService.formatResults(mockResults);

			expect(formatted).toContain("💡 **Usage Tips:**");
			expect(formatted).toContain(
				"Always customize hooks for your specific audience",
			);
			expect(formatted).toContain(
				"Test different variations to see what works best",
			);
		});
	});

	describe("Edge cases", () => {
		it("should handle empty hooks array in category", () => {
			const emptyHooksData: HookData = {
				networks: {
					empty: {
						name: "Empty Network",
						categories: {
							empty_category: {
								name: "Empty Category",
								hooks: [],
							},
						},
					},
				},
				categories: { global: {} },
				usage_tips: {},
			};

			const service = new HookSearchService(emptyHooksData);
			const results = service.searchHooks({ network: "empty" });

			expect(results).toHaveLength(0);
		});

		it("should handle missing hooks property in category", () => {
			const malformedData: HookData = {
				networks: {
					malformed: {
						name: "Malformed Network",
						categories: {
							malformed_category: {
								name: "Malformed Category",
								// biome-ignore lint/suspicious/noExplicitAny: any type is needed for malformed test data
								hooks: undefined as any,
							},
						},
					},
				},
				categories: { global: {} },
				usage_tips: {},
			};

			const service = new HookSearchService(malformedData);
			const results = service.searchHooks({ network: "malformed" });

			expect(results).toHaveLength(0);
		});
	});
});
