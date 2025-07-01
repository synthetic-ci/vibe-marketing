import type { DoNotUseData } from "../types/humanizing.js";

export function createPhrasesToAvoidResource(doNotUseData: DoNotUseData) {
	return {
		uri: "vibe://humanizing/phrases-to-avoid",
		metadata: {
			title: "Phrases to Avoid",
			description:
				"List of phrases that should be avoided when writing content to make it more human and less AI-like",
			mimeType: "application/x-yaml",
		},
		handler: async (uri: URL) => {
			// Reconstruct the YAML content from the loaded data
			const yamlContent = `do_not_use:
  phrases:
${doNotUseData.do_not_use.phrases.map((phrase) => `    - ${phrase}`).join("\n")}`;

			return {
				contents: [
					{
						uri: uri.href,
						text: yamlContent,
					},
				],
			};
		},
	};
}
