import { beforeEach, describe, it, vi, expect as vitestExpected } from "vitest";

// biome-ignore lint: any type is needed for test compatibility
const expect = vitestExpected as any;

import type { HookData } from "../../types/hooks.js";
import { findSocialMediaHooksPrompt } from "../findSocialMediaHooksPrompt.js";

describe("findSocialMediaHooksPrompt", () => {
	const mockHooksData: HookData = {
		networks: {
			twitter: {
				name: "Twitter/X",
				categories: {
					engagement: {
						name: "Engagement",
						hooks: ["Ask a question", "Share a controversial opinion"],
					},
					educational: {
						name: "Educational",
						hooks: ["Thread about tips", "Quick tutorial"],
					},
				},
			},
			instagram: {
				name: "Instagram",
				categories: {
					storytelling: {
						name: "Storytelling",
						hooks: ["Behind the scenes", "Personal journey"],
					},
					promotional: {
						name: "Promotional",
						hooks: ["New product launch", "Limited time offer"],
					},
				},
			},
			linkedin: {
				name: "LinkedIn",
				categories: {
					professional: {
						name: "Professional",
						hooks: ["Career insights", "Industry trends"],
					},
				},
			},
		},
		categories: {
			global: {
				engagement: {
					description: "Content that encourages interaction",
					keywords: ["question", "poll", "discussion"],
				},
				educational: {
					description: "Content that teaches something",
					keywords: ["tutorial", "tips", "how-to"],
				},
				storytelling: {
					description: "Content that tells a story",
					keywords: ["story", "journey", "experience"],
				},
			},
		},
		usage_tips: {
			twitter: "Keep it concise and punchy",
			instagram: "Focus on visual storytelling",
		},
	};

	describe("prompt definition", () => {
		it("should return correct prompt definition", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);

			expect(prompt.name).toBe("find-social-media-hooks");
			expect(prompt.definition.title).toBe("Find Social Media Hooks");
			expect(prompt.definition.description).toContain(
				"effective social media hooks",
			);
			expect(prompt.definition.argsSchema).toHaveProperty("network");
			expect(prompt.definition.argsSchema).toHaveProperty("category");
			expect(prompt.definition.argsSchema).toHaveProperty("context");
		});
	});

	describe("network completable", () => {
		it("should return filtered networks based on input", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const networkCompletable = prompt.definition.argsSchema.network as any;

			if (
				typeof networkCompletable === "object" &&
				networkCompletable._def?.complete
			) {
				const completions = networkCompletable._def.complete("tw");
				expect(completions).toEqual(["twitter"]);
			}
		});

		it("should return all networks when no input provided", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const networkCompletable = prompt.definition.argsSchema.network as any;

			if (
				typeof networkCompletable === "object" &&
				networkCompletable._def?.complete
			) {
				const completions = networkCompletable._def.complete("");
				expect(completions).toEqual(["twitter", "instagram", "linkedin"]);
			}
		});

		it("should return case-insensitive matches", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const networkCompletable = prompt.definition.argsSchema.network as any;

			if (
				typeof networkCompletable === "object" &&
				networkCompletable._def?.complete
			) {
				const completions = networkCompletable._def.complete("INS");
				expect(completions).toEqual(["instagram"]);
			}
		});

		it("should return empty array when no matches found", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const networkCompletable = prompt.definition.argsSchema.network as any;

			if (
				typeof networkCompletable === "object" &&
				networkCompletable._def?.complete
			) {
				const completions = networkCompletable._def.complete("xyz");
				expect(completions).toEqual([]);
			}
		});
	});

	describe("category completable", () => {
		it("should return global categories when no network selected", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const categoryCompletable = prompt.definition.argsSchema.category as any;

			if (
				typeof categoryCompletable === "object" &&
				categoryCompletable._def?.complete
			) {
				const completions = categoryCompletable._def.complete("", {});
				expect(completions).toEqual([
					"engagement",
					"educational",
					"storytelling",
				]);
			}
		});

		it("should return merged categories when network is selected", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const categoryCompletable = prompt.definition.argsSchema.category as any;

			if (
				typeof categoryCompletable === "object" &&
				categoryCompletable._def?.complete
			) {
				const completions = categoryCompletable._def.complete("", {
					arguments: { network: "twitter" },
				});
				expect(completions).toEqual([
					"engagement",
					"educational",
					"storytelling",
				]);
			}
		});

		it("should include network-specific categories not in global", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const categoryCompletable = prompt.definition.argsSchema.category as any;

			if (
				typeof categoryCompletable === "object" &&
				categoryCompletable._def?.complete
			) {
				const completions = categoryCompletable._def.complete("", {
					arguments: { network: "instagram" },
				});
				expect(completions).toContain("promotional");
				expect(completions).toContain("storytelling");
			}
		});

		it("should filter categories based on input", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const categoryCompletable = prompt.definition.argsSchema.category as any;

			if (
				typeof categoryCompletable === "object" &&
				categoryCompletable._def?.complete
			) {
				const completions = categoryCompletable._def.complete("eng", {
					arguments: { network: "twitter" },
				});
				expect(completions).toEqual(["engagement"]);
			}
		});

		it("should be case-insensitive", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const categoryCompletable = prompt.definition.argsSchema.category as any;

			if (
				typeof categoryCompletable === "object" &&
				categoryCompletable._def?.complete
			) {
				const completions = categoryCompletable._def.complete("EDU");
				expect(completions).toEqual(["educational"]);
			}
		});

		it("should handle network not in data", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const categoryCompletable = prompt.definition.argsSchema.category as any;

			if (
				typeof categoryCompletable === "object" &&
				categoryCompletable._def?.complete
			) {
				const completions = categoryCompletable._def.complete("", {
					arguments: { network: "unknown" },
				});
				expect(completions).toEqual([
					"engagement",
					"educational",
					"storytelling",
				]);
			}
		});

		it("should handle missing global categories", () => {
			const hooksDataWithoutGlobal: HookData = {
				...mockHooksData,
				categories: { global: {} },
			};

			const prompt = findSocialMediaHooksPrompt(hooksDataWithoutGlobal);
			const categoryCompletable = prompt.definition.argsSchema.category as any;

			if (
				typeof categoryCompletable === "object" &&
				categoryCompletable._def?.complete
			) {
				const completions = categoryCompletable._def.complete("", {
					arguments: { network: "twitter" },
				});
				expect(completions).toEqual(["engagement", "educational"]);
			}
		});
	});

	describe("handler", () => {
		it("should generate prompt with all parameters", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const result = prompt.handler({
				network: "twitter",
				category: "engagement",
				context: "Looking for viral content ideas",
			});

			expect(result.messages).toHaveLength(1);
			expect(result.messages[0].role).toBe("user");
			const text = result.messages[0].content.text;
			expect(text).toContain("for twitter");
			expect(text).toContain("in the engagement category");
			expect(text).toContain("Context: Looking for viral content ideas");
			expect(text).toContain('network="twitter"');
			expect(text).toContain('category="engagement"');
		});

		it("should generate prompt with only network", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const result = prompt.handler({
				network: "instagram",
				category: "",
				context: "",
			});

			const text = result.messages[0].content.text;
			expect(text).toContain("for instagram");
			expect(text).not.toContain("in the");
			expect(text).not.toContain("Context:");
			expect(text).toContain('network="instagram"');
			expect(text).not.toContain("category=");
		});

		it("should generate prompt with only category", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const result = prompt.handler({
				network: "",
				category: "educational",
				context: "",
			});

			const text = result.messages[0].content.text;
			expect(text).not.toContain("hooks for educational");
			expect(text).toContain("in the educational category");
			expect(text).not.toContain("Context:");
			expect(text).not.toContain("network=");
			expect(text).toContain('category="educational"');
		});

		it("should generate basic prompt with no parameters", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const result = prompt.handler({
				network: "",
				category: "",
				context: "",
			});

			const text = result.messages[0].content.text;
			expect(text).toContain("finding effective social media hooks");
			expect(text).not.toContain("hooks for twitter");
			expect(text).not.toContain("in the");
			expect(text).not.toContain("Context:");
			expect(text).toContain("search for relevant hooks.");
			expect(text).not.toContain("network=");
			expect(text).not.toContain("category=");
		});

		it("should include context when provided", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const result = prompt.handler({
				network: "",
				category: "",
				context: "Need hooks for B2B SaaS company",
			});

			const text = result.messages[0].content.text;
			expect(text).toContain("Context: Need hooks for B2B SaaS company");
		});

		it("should include platform-specific guidance", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const result = prompt.handler({
				network: "",
				category: "",
				context: "",
			});

			const text = result.messages[0].content.text;
			expect(text).toContain("Twitter: Brief, punchy hooks");
			expect(text).toContain("Instagram: Visual-first hooks");
			expect(text).toContain("LinkedIn: Professional, value-driven hooks");
			expect(text).toContain("TikTok: Trendy, attention-grabbing hooks");
			expect(text).toContain("YouTube: Curiosity-driven hooks");
		});

		it("should include category considerations", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const result = prompt.handler({
				network: "",
				category: "",
				context: "",
			});

			const text = result.messages[0].content.text;
			expect(text).toContain("Engagement: Focus on interaction");
			expect(text).toContain("Educational: Lead with value");
			expect(text).toContain("Promotional: Balance selling with value");
			expect(text).toContain("Storytelling: Create emotional connections");
		});

		it("should include best practices", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const result = prompt.handler({
				network: "",
				category: "",
				context: "",
			});

			const text = result.messages[0].content.text;
			expect(text).toContain("Start with the most compelling part");
			expect(text).toContain("Use pattern interrupts");
			expect(text).toContain("Create curiosity gaps");
			expect(text).toContain("Promise clear value");
			expect(text).toContain("Match the platform's tone");
		});

		it("should handle special characters in parameters", () => {
			const prompt = findSocialMediaHooksPrompt(mockHooksData);
			const result = prompt.handler({
				network: "twitter & instagram",
				category: "engagement/promotional",
				context: "Test with special chars: @#$%",
			});

			const text = result.messages[0].content.text;
			expect(text).toContain("for twitter & instagram");
			expect(text).toContain("in the engagement/promotional category");
			expect(text).toContain("Context: Test with special chars: @#$%");
		});
	});

	describe("edge cases", () => {
		it("should handle empty hooksData", () => {
			const emptyHooksData: HookData = {
				networks: {},
				categories: { global: {} },
				usage_tips: {},
			};

			const prompt = findSocialMediaHooksPrompt(emptyHooksData);

			expect(prompt.name).toBe("find-social-media-hooks");

			const result = prompt.handler({
				network: "",
				category: "",
				context: "",
			});

			expect(result.messages).toHaveLength(1);
			expect(result.messages[0].content.text).toContain(
				"finding effective social media hooks",
			);
		});

		it("should handle hooksData with missing categories", () => {
			const partialHooksData: HookData = {
				networks: {
					twitter: {
						name: "Twitter",
						categories: {},
					},
				},
				categories: { global: {} },
				usage_tips: {},
			};

			const prompt = findSocialMediaHooksPrompt(partialHooksData);
			const categoryCompletable = prompt.definition.argsSchema.category as any;

			if (
				typeof categoryCompletable === "object" &&
				categoryCompletable._def?.complete
			) {
				const completions = categoryCompletable._def.complete("", {
					arguments: { network: "twitter" },
				});
				expect(completions).toEqual([]);
			}
		});
	});
});
