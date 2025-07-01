import { beforeEach, describe, it, expect as vitestExpected } from "vitest";

// biome-ignore lint: any type is needed for test compatibility
const expect = vitestExpected as any;

import type {
	CopywritingData,
	CopywritingFramework,
	GeneralRules,
} from "../../types/copywriting.js";
import { CopywritingService } from "../copywritingService.js";

// Mock data for testing
const mockCopywritingData: CopywritingData = {
	twitter: {
		name: "Twitter/X",
		aida: {
			title: "AIDA Framework for Twitter/X",
			components: [
				{
					name: "Attention (Hook)",
					purpose: "Grab immediate attention in the timeline.",
					format: "Punchy opener, surprising fact, or provocative question.",
					examples: [
						"I made $50K in 3 months selling nothing. Here's how:",
						"Most people get productivity completely wrong.",
					],
					note: "Must capture attention within first few words due to fast scrolling.",
				},
				{
					name: "Interest (Setup)",
					purpose: "Build curiosity and context quickly.",
					format: "Brief context or problem identification.",
					examples: [
						"Everyone talks about hustle culture, but nobody mentions the hidden cost.",
						"I spent 2 years trying every productivity hack. Most were garbage.",
					],
					note: "Keep concise due to character limits.",
				},
			],
		},
		pas: {
			title: "PAS Framework for Twitter/X",
			components: [
				{
					name: "Problem",
					purpose: "Hit a nerve with a specific pain point.",
					format: "Punchy question or statement about the issue.",
					examples: [
						"Your content gets 12 likes max?",
						"Still trading time for money in 2024?",
					],
					note: "Make it sharp and immediately relatable.",
				},
			],
		},
		formatting_checklist: [
			"Do not use hashtags",
			"Do not use emojis",
			"Consider thread format for complex topics",
		],
	},
	instagram: {
		name: "Instagram",
		aida: {
			title: "AIDA Framework for Instagram",
			components: [
				{
					name: "Attention",
					purpose: "Visual hook that stops the scroll.",
					format: "Eye-catching opener with visual appeal.",
					examples: [
						"This changed everything for my business:",
						"POV: You just discovered the secret to...",
					],
					note: "Instagram is visual-first, make it pop.",
				},
			],
		},
		formatting_checklist: [
			"Use relevant hashtags (5-15 per post)",
			"Include emojis strategically",
		],
	},
	linkedin: {
		name: "LinkedIn",
		// No frameworks defined for this network
		formatting_checklist: [
			"Professional tone required",
			"Tag relevant connections",
		],
	},
};

const mockGeneralRules: GeneralRules = {
	general_rules: [
		"NEVER USE Em Dashes (—), En Dashes (–) , and Hyphens (-)",
		"Misspellings are allowed, especially for most often misspelled words",
		"use text style abbreviations like tbh, idk, lol, etc., but only where appropriate and sparingly",
	],
};

describe("CopywritingService", () => {
	let copywritingService: CopywritingService;

	beforeEach(() => {
		copywritingService = new CopywritingService(
			mockCopywritingData,
			mockGeneralRules,
		);
	});

	describe("constructor", () => {
		it("should initialize with provided data", () => {
			expect(copywritingService).toBeInstanceOf(CopywritingService);
		});
	});

	describe("getAvailableNetworks", () => {
		it("should return all available networks", () => {
			const networks = copywritingService.getAvailableNetworks();

			expect(networks).toEqual(["twitter", "instagram", "linkedin"]);
			expect(networks).toHaveLength(3);
		});

		it("should return empty array if no networks exist", () => {
			const emptyService = new CopywritingService({}, mockGeneralRules);
			const networks = emptyService.getAvailableNetworks();

			expect(networks).toEqual([]);
			expect(networks).toHaveLength(0);
		});
	});

	describe("getNetworkData", () => {
		it("should return network data for valid network", () => {
			const twitterData = copywritingService.getNetworkData("twitter");

			expect(twitterData).toEqual(mockCopywritingData.twitter);
			expect(twitterData?.name).toBe("Twitter/X");
		});

		it("should handle case insensitive network names", () => {
			const twitterData = copywritingService.getNetworkData("TWITTER");

			expect(twitterData).toEqual(mockCopywritingData.twitter);
			expect(twitterData?.name).toBe("Twitter/X");
		});

		it("should return null for non-existent network", () => {
			const result = copywritingService.getNetworkData("nonexistent");

			expect(result).toBeNull();
		});

		it("should return null for empty string", () => {
			const result = copywritingService.getNetworkData("");

			expect(result).toBeNull();
		});
	});

	describe("getNetworkFrameworks", () => {
		it("should return available frameworks for twitter", () => {
			const frameworks = copywritingService.getNetworkFrameworks("twitter");

			expect(frameworks).toEqual(["aida", "pas"]);
			expect(frameworks).toHaveLength(2);
		});

		it("should return available frameworks for instagram", () => {
			const frameworks = copywritingService.getNetworkFrameworks("instagram");

			expect(frameworks).toEqual(["aida"]);
			expect(frameworks).toHaveLength(1);
		});

		it("should return empty array for network with no frameworks", () => {
			const frameworks = copywritingService.getNetworkFrameworks("linkedin");

			expect(frameworks).toEqual([]);
			expect(frameworks).toHaveLength(0);
		});

		it("should return empty array for non-existent network", () => {
			const frameworks = copywritingService.getNetworkFrameworks("nonexistent");

			expect(frameworks).toEqual([]);
			expect(frameworks).toHaveLength(0);
		});

		it("should handle case insensitive network names", () => {
			const frameworks = copywritingService.getNetworkFrameworks("TWITTER");

			expect(frameworks).toEqual(["aida", "pas"]);
		});
	});

	describe("getFramework", () => {
		it("should return specific framework for network", () => {
			const aidaFramework = copywritingService.getFramework("twitter", "aida");

			expect(aidaFramework).toEqual(mockCopywritingData.twitter.aida);
			expect(aidaFramework?.title).toBe("AIDA Framework for Twitter/X");
			expect(aidaFramework?.components).toHaveLength(2);
		});

		it("should handle case insensitive framework names", () => {
			const aidaFramework = copywritingService.getFramework("twitter", "AIDA");

			expect(aidaFramework).toEqual(mockCopywritingData.twitter.aida);
		});

		it("should return null for non-existent framework", () => {
			const result = copywritingService.getFramework("twitter", "nonexistent");

			expect(result).toBeNull();
		});

		it("should return null for non-existent network", () => {
			const result = copywritingService.getFramework("nonexistent", "aida");

			expect(result).toBeNull();
		});

		it("should return null for empty network or framework", () => {
			expect(copywritingService.getFramework("", "aida")).toBeNull();
			expect(copywritingService.getFramework("twitter", "")).toBeNull();
			expect(copywritingService.getFramework("", "")).toBeNull();
		});

		it("should handle all supported framework types", () => {
			const supportedFrameworks = [
				"aida",
				"pas",
				"bab",
				"4cs",
				"uuuu",
				"pppp",
				"slap",
				"app",
				"storybrand",
			];

			// Test that the method properly checks for these framework types
			// Most will return null since they don't exist in our mock data, but method should handle them
			supportedFrameworks.forEach((framework) => {
				const result = copywritingService.getFramework("twitter", framework);
				// Should not throw an error
				expect(result === null || typeof result === "object").toBe(true);
			});
		});
	});

	describe("formatNetworkCopywriting", () => {
		it("should format network with frameworks and formatting checklist", () => {
			const formatted = copywritingService.formatNetworkCopywriting("twitter");

			expect(formatted).toContain("# Twitter/X Copywriting Frameworks");
			expect(formatted).toContain("## Available Frameworks:");
			expect(formatted).toContain("- **AIDA**: AIDA Framework for Twitter/X");
			expect(formatted).toContain("- **PAS**: PAS Framework for Twitter/X");
			expect(formatted).toContain("## Formatting Guidelines:");
			expect(formatted).toContain("- Do not use hashtags");
			expect(formatted).toContain("- Do not use emojis");
			expect(formatted).toContain(
				"- Consider thread format for complex topics",
			);
			expect(formatted).toContain("📋 General Copywriting Rules");
			expect(formatted).toContain("NEVER USE Em Dashes");
		});

		it("should format network with frameworks but no formatting checklist", () => {
			// Create mock data without formatting_checklist
			const mockDataWithoutFormatting: CopywritingData = {
				test: {
					name: "Test Network",
					// biome-ignore lint/style/noNonNullAssertion: this is a test
					aida: mockCopywritingData.twitter.aida!,
				},
			};

			const service = new CopywritingService(
				mockDataWithoutFormatting,
				mockGeneralRules,
			);
			const formatted = service.formatNetworkCopywriting("test");

			expect(formatted).toContain("# Test Network Copywriting Frameworks");
			expect(formatted).toContain("## Available Frameworks:");
			expect(formatted).toContain("- **AIDA**: AIDA Framework for Twitter/X");
			expect(formatted).not.toContain("## Formatting Guidelines:");
			expect(formatted).toContain("📋 General Copywriting Rules");
		});

		it("should handle network with no frameworks", () => {
			const formatted = copywritingService.formatNetworkCopywriting("linkedin");

			expect(formatted).toContain("# LinkedIn Copywriting Frameworks");
			expect(formatted).toContain("## Formatting Guidelines:");
			expect(formatted).toContain("- Professional tone required");
			expect(formatted).toContain("📋 General Copywriting Rules");
			expect(formatted).not.toContain("## Available Frameworks:");
		});

		it("should return error message for non-existent network", () => {
			const formatted =
				copywritingService.formatNetworkCopywriting("nonexistent");

			expect(formatted).toContain('Network "nonexistent" not found');
			expect(formatted).toContain(
				"Available networks: twitter, instagram, linkedin",
			);
		});

		it("should handle case insensitive network names", () => {
			const formatted = copywritingService.formatNetworkCopywriting("TWITTER");

			expect(formatted).toContain("# Twitter/X Copywriting Frameworks");
		});
	});

	describe("formatFrameworksList", () => {
		it("should format frameworks list for network with frameworks", () => {
			const formatted = copywritingService.formatFrameworksList("twitter");

			expect(formatted).toContain(
				"# Twitter/X - Available Copywriting Frameworks",
			);
			expect(formatted).toContain("## AIDA");
			expect(formatted).toContain("AIDA Framework for Twitter/X");
			expect(formatted).toContain("## PAS");
			expect(formatted).toContain("PAS Framework for Twitter/X");
			expect(formatted).not.toContain("📋 General Copywriting Rules");
			expect(formatted).not.toContain("## Formatting Guidelines:");
		});

		it("should handle network with no frameworks", () => {
			const formatted = copywritingService.formatFrameworksList("linkedin");

			expect(formatted).toContain(
				"# LinkedIn - Available Copywriting Frameworks",
			);
			expect(formatted).toContain(
				"No copywriting frameworks available for LinkedIn",
			);
		});

		it("should return error message for non-existent network", () => {
			const formatted = copywritingService.formatFrameworksList("nonexistent");

			expect(formatted).toContain('Network "nonexistent" not found');
			expect(formatted).toContain(
				"Available networks: twitter, instagram, linkedin",
			);
		});
	});

	describe("formatFramework", () => {
		it("should format specific framework with all components", () => {
			const formatted = copywritingService.formatFramework("twitter", "aida");

			expect(formatted).toContain("# AIDA Framework for Twitter/X");
			expect(formatted).toContain("*For Twitter/X*");
			expect(formatted).toContain("## 1. Attention (Hook)");
			expect(formatted).toContain(
				"**Purpose:** Grab immediate attention in the timeline.",
			);
			expect(formatted).toContain(
				"**Format:** Punchy opener, surprising fact, or provocative question.",
			);
			expect(formatted).toContain("**Examples:**");
			expect(formatted).toContain(
				'- "I made $50K in 3 months selling nothing. Here\'s how:"',
			);
			expect(formatted).toContain(
				"*Note: Must capture attention within first few words due to fast scrolling.*",
			);
			expect(formatted).toContain("## 2. Interest (Setup)");
			expect(formatted).toContain("📋 General Copywriting Rules");
		});

		it("should handle framework with no examples", () => {
			// Create mock framework without examples
			const mockFrameworkNoExamples: CopywritingFramework = {
				title: "Test Framework",
				components: [
					{
						name: "Test Component",
						purpose: "Test purpose",
						format: "Test format",
						examples: [],
						note: "Test note",
					},
				],
			};

			const mockDataWithNoExamples: CopywritingData = {
				test: {
					name: "Test Network",
					aida: mockFrameworkNoExamples,
				},
			};

			const service = new CopywritingService(
				mockDataWithNoExamples,
				mockGeneralRules,
			);
			const formatted = service.formatFramework("test", "aida");

			expect(formatted).toContain("# Test Framework");
			expect(formatted).toContain("## 1. Test Component");
			expect(formatted).not.toContain("**Examples:**");
		});

		it("should handle framework with no note", () => {
			// Create mock framework without note
			const mockFrameworkNoNote: CopywritingFramework = {
				title: "Test Framework",
				components: [
					{
						name: "Test Component",
						purpose: "Test purpose",
						format: "Test format",
						examples: ["Example 1"],
						note: "",
					},
				],
			};

			const mockDataWithNoNote: CopywritingData = {
				test: {
					name: "Test Network",
					aida: mockFrameworkNoNote,
				},
			};

			const service = new CopywritingService(
				mockDataWithNoNote,
				mockGeneralRules,
			);
			const formatted = service.formatFramework("test", "aida");

			expect(formatted).toContain("# Test Framework");
			expect(formatted).toContain("## 1. Test Component");
			expect(formatted).not.toContain("*Note:");
		});

		it("should return error message for non-existent framework", () => {
			const formatted = copywritingService.formatFramework(
				"twitter",
				"nonexistent",
			);

			expect(formatted).toContain(
				'Framework "nonexistent" not found for twitter',
			);
			expect(formatted).toContain("Available frameworks: aida, pas");
		});

		it("should return error message for non-existent network", () => {
			const formatted = copywritingService.formatFramework(
				"nonexistent",
				"aida",
			);

			expect(formatted).toContain('Framework "aida" not found for nonexistent');
		});

		it("should handle case insensitive inputs", () => {
			const formatted = copywritingService.formatFramework("TWITTER", "AIDA");

			expect(formatted).toContain("# AIDA Framework for Twitter/X");
		});
	});

	describe("getGeneralRules", () => {
		it("should return formatted general rules", () => {
			const rules = copywritingService.getGeneralRules();

			expect(rules).toContain("# General Copywriting Rules");
			expect(rules).toContain(
				"- NEVER USE Em Dashes (—), En Dashes (–) , and Hyphens (-)",
			);
			expect(rules).toContain(
				"- Misspellings are allowed, especially for most often misspelled words",
			);
			expect(rules).toContain(
				"- use text style abbreviations like tbh, idk, lol, etc., but only where appropriate and sparingly",
			);
		});

		it("should handle empty general rules", () => {
			const emptyRules: GeneralRules = { general_rules: [] };
			const service = new CopywritingService(mockCopywritingData, emptyRules);
			const rules = service.getGeneralRules();

			expect(rules).toContain("# General Copywriting Rules");
			expect(rules).toBe("# General Copywriting Rules\n\n");
		});
	});

	describe("private getGeneralRulesFooter", () => {
		it("should be included in formatNetworkCopywriting output", () => {
			const formatted = copywritingService.formatNetworkCopywriting("twitter");

			expect(formatted).toContain("---");
			expect(formatted).toContain("## 📋 General Copywriting Rules");
			expect(formatted).toContain("- NEVER USE Em Dashes");
		});

		it("should be included in formatFramework output", () => {
			const formatted = copywritingService.formatFramework("twitter", "aida");

			expect(formatted).toContain("---");
			expect(formatted).toContain("## 📋 General Copywriting Rules");
			expect(formatted).toContain("- NEVER USE Em Dashes");
		});

		it("should NOT be included in formatFrameworksList output", () => {
			const formatted = copywritingService.formatFrameworksList("twitter");

			expect(formatted).not.toContain("---");
			expect(formatted).not.toContain("## 📋 General Copywriting Rules");
		});
	});

	describe("edge cases", () => {
		it("should handle malformed framework data", () => {
			const malformedData: CopywritingData = {
				malformed: {
					name: "Malformed Network",
					// biome-ignore lint/suspicious/noExplicitAny: any type is needed for malformed test data
					aida: { invalid: "data" } as any,
				},
			};

			const service = new CopywritingService(malformedData, mockGeneralRules);
			const framework = service.getFramework("malformed", "aida");

			expect(framework).toBeNull();
		});

		it("should handle network data without name property", () => {
			const dataWithoutName: CopywritingData = {
				noname: {
					// biome-ignore lint/suspicious/noExplicitAny: any type is needed for test data without name
					name: undefined as any,
					aida: mockCopywritingData.twitter.aida,
				},
			};

			const service = new CopywritingService(dataWithoutName, mockGeneralRules);
			const formatted = service.formatNetworkCopywriting("noname");

			// Should not throw an error, but handle gracefully
			expect(typeof formatted).toBe("string");
		});

		it("should handle empty framework components array", () => {
			const emptyFramework: CopywritingFramework = {
				title: "Empty Framework",
				components: [],
			};

			const dataWithEmptyFramework: CopywritingData = {
				empty: {
					name: "Empty Network",
					aida: emptyFramework,
				},
			};

			const service = new CopywritingService(
				dataWithEmptyFramework,
				mockGeneralRules,
			);
			const formatted = service.formatFramework("empty", "aida");

			expect(formatted).toContain("# Empty Framework");
			expect(formatted).not.toContain("## 1.");
		});

		it("should handle special characters in network names", () => {
			const specialCharData: CopywritingData = {
				"special-network_123": {
					name: "Special Network & Co.",
					aida: mockCopywritingData.twitter.aida,
				},
			};

			const service = new CopywritingService(specialCharData, mockGeneralRules);
			const networks = service.getAvailableNetworks();

			expect(networks).toContain("special-network_123");
		});
	});
});
