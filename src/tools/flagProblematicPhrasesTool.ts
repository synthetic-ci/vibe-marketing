import type { DoNotUseData } from "@lib-types/humanizing.js";
import { z } from "zod";

export const flagProblematicPhrasesToolDefinition = {
	title: "Flag Problematic Phrases",
	description:
		"Check text for phrases that should be avoided to make content more human and less AI-like. Returns any flagged phrases found in the text.",
	inputSchema: {
		text: z.string().describe("The text to check for problematic phrases"),
	},
};

export const flagProblematicPhrasesHandler =
	(doNotUseData: DoNotUseData) => async (args: { text: string }) => {
		try {
			const { text } = args;
			const phrases = doNotUseData.do_not_use.phrases;
			const foundPhrases: Array<{ phrase: string; position: number }> = [];

			// Check for each phrase in the text (case-insensitive)
			for (const phrase of phrases) {
				const lowerText = text.toLowerCase();
				const lowerPhrase = phrase.toLowerCase();
				let position = lowerText.indexOf(lowerPhrase);

				while (position !== -1) {
					foundPhrases.push({ phrase, position });
					position = lowerText.indexOf(lowerPhrase, position + 1);
				}
			}

			if (foundPhrases.length === 0) {
				return {
					content: [
						{
							type: "text" as const,
							text: "✅ No problematic phrases found in the text.",
						},
					],
				};
			}

			// Sort by position in text
			foundPhrases.sort((a, b) => a.position - b.position);

			const responseText =
				`🚩 **Found ${foundPhrases.length} problematic phrase(s) in the text:**\n\n` +
				foundPhrases
					.map(
						(item, index) =>
							`${index + 1}. "${item.phrase}" (at position ${item.position})`,
					)
					.join("\n") +
				"\n\n**Suggestions:**\n" +
				"• Consider rewriting these phrases to sound more natural and human\n" +
				"• Avoid overly promotional or AI-like language\n" +
				"• Use more conversational and authentic expressions";

			return {
				content: [
					{
						type: "text" as const,
						text: responseText,
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: "text" as const,
						text: `Error checking text for problematic phrases: ${error instanceof Error ? error.message : "Unknown error"}`,
					},
				],
				isError: true,
			};
		}
	};
