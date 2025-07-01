import { beforeEach, describe, it, expect as vitestExpected } from "vitest";

// biome-ignore lint: any type is needed for test compatibility
const expect = vitestExpected as any;

import type { Archetype } from "../../types/archetypes.js";
import { ArchetypeFormatter } from "../archetypeFormatter.js";

describe("ArchetypeFormatter", () => {
	let formatter: ArchetypeFormatter;

	beforeEach(() => {
		formatter = new ArchetypeFormatter();
	});

	describe("formatArchetype", () => {
		it("should format a complete archetype correctly", () => {
			const mockArchetype: Archetype = {
				archetype_name: "The Educator",
				description:
					"Shares knowledge and insights to help others learn and grow",
				tweet_style_examples: [
					"Here's what I learned after 5 years in the industry:",
					"🧵 Thread: Everything you need to know about [topic]",
					"Quick tip: This simple trick will save you hours of work",
				],
			};

			const result = formatter.formatArchetype(mockArchetype);

			expect(result).toContain("## The Educator");
			expect(result).toContain(
				"**Description:** Shares knowledge and insights to help others learn and grow",
			);
			expect(result).toContain("**Tweet Style Examples:**");
			expect(result).toContain(
				'1. "Here\'s what I learned after 5 years in the industry:"',
			);
			expect(result).toContain(
				'2. "🧵 Thread: Everything you need to know about [topic]"',
			);
			expect(result).toContain(
				'3. "Quick tip: This simple trick will save you hours of work"',
			);
		});

		it("should handle archetype with single tweet example", () => {
			const mockArchetype: Archetype = {
				archetype_name: "Minimalist",
				description: "Less is more",
				tweet_style_examples: ["Simple truth."],
			};

			const result = formatter.formatArchetype(mockArchetype);

			expect(result).toContain("## Minimalist");
			expect(result).toContain("**Description:** Less is more");
			expect(result).toContain('1. "Simple truth."');
		});

		it("should handle archetype with empty tweet examples", () => {
			const mockArchetype: Archetype = {
				archetype_name: "Silent Type",
				description: "Actions speak louder than words",
				tweet_style_examples: [],
			};

			const result = formatter.formatArchetype(mockArchetype);

			expect(result).toContain("## Silent Type");
			expect(result).toContain(
				"**Description:** Actions speak louder than words",
			);
			expect(result).toContain("**Tweet Style Examples:**");
			// Should not contain any numbered examples
			expect(result).not.toMatch(/\d+\. "/);
		});

		it("should handle special characters in archetype name and description", () => {
			const mockArchetype: Archetype = {
				archetype_name: "The Question & Answer Expert",
				description: "Specializes in Q&A sessions and interactive content",
				tweet_style_examples: [
					"What's your biggest challenge with [topic]?",
					"Ask me anything about [industry] - I'll answer all questions!",
				],
			};

			const result = formatter.formatArchetype(mockArchetype);

			expect(result).toContain("## The Question & Answer Expert");
			expect(result).toContain(
				"Specializes in Q&A sessions and interactive content",
			);
			expect(result).toContain(
				'1. "What\'s your biggest challenge with [topic]?"',
			);
			expect(result).toContain(
				'2. "Ask me anything about [industry] - I\'ll answer all questions!"',
			);
		});

		it("should preserve formatting in tweet examples", () => {
			const mockArchetype: Archetype = {
				archetype_name: "The Formatter",
				description: "Uses formatting effectively",
				tweet_style_examples: [
					"**Bold** and *italic* text",
					"Line breaks\nand tabs\t work",
					"Special chars: @#$%^&*()",
				],
			};

			const result = formatter.formatArchetype(mockArchetype);

			expect(result).toContain('1. "**Bold** and *italic* text"');
			expect(result).toContain('2. "Line breaks\nand tabs\t work"');
			expect(result).toContain('3. "Special chars: @#$%^&*()"');
		});
	});

	describe("formatArchetypeList", () => {
		it("should format a list of archetypes correctly", () => {
			const mockArchetypes = [
				{
					name: "The Educator",
					description: "Shares knowledge and insights",
				},
				{
					name: "The Entertainer",
					description: "Creates fun and engaging content",
				},
				{
					name: "The Motivator",
					description: "Inspires and encourages others",
				},
			];

			const result = formatter.formatArchetypeList(mockArchetypes);

			expect(result).toContain("Available Voice Archetypes (3 total):");
			expect(result).toContain(
				"• **The Educator**\n  Shares knowledge and insights",
			);
			expect(result).toContain(
				"• **The Entertainer**\n  Creates fun and engaging content",
			);
			expect(result).toContain(
				"• **The Motivator**\n  Inspires and encourages others",
			);
		});

		it("should handle single archetype in list", () => {
			const mockArchetypes = [
				{
					name: "Solo Act",
					description: "Works alone but effectively",
				},
			];

			const result = formatter.formatArchetypeList(mockArchetypes);

			expect(result).toContain("Available Voice Archetypes (1 total):");
			expect(result).toContain("• **Solo Act**\n  Works alone but effectively");
		});

		it("should handle empty archetype list", () => {
			const mockArchetypes: Array<{ name: string; description: string }> = [];

			const result = formatter.formatArchetypeList(mockArchetypes);

			expect(result).toContain("Available Voice Archetypes (0 total):");
			// Should not contain any bullet points
			expect(result).not.toContain("•");
		});

		it("should handle archetypes with special characters", () => {
			const mockArchetypes = [
				{
					name: "The Q&A Expert",
					description: "Specializes in questions & answers",
				},
				{
					name: "The @Mention Master",
					description: "Great at networking & connecting",
				},
			];

			const result = formatter.formatArchetypeList(mockArchetypes);

			expect(result).toContain("Available Voice Archetypes (2 total):");
			expect(result).toContain(
				"• **The Q&A Expert**\n  Specializes in questions & answers",
			);
			expect(result).toContain(
				"• **The @Mention Master**\n  Great at networking & connecting",
			);
		});

		it("should handle long descriptions properly", () => {
			const mockArchetypes = [
				{
					name: "Verbose",
					description:
						"This is a very long description that goes on and on about the archetype and provides extensive details about what this particular voice type represents and how it can be used effectively in social media content creation and audience engagement strategies.",
				},
			];

			const result = formatter.formatArchetypeList(mockArchetypes);

			expect(result).toContain("Available Voice Archetypes (1 total):");
			expect(result).toContain("• **Verbose**");
			expect(result).toContain(
				"This is a very long description that goes on and on",
			);
		});
	});
});
