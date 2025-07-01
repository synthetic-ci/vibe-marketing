import type { ArchetypeData } from "@lib-types/archetypes.js";
import type { ArchetypeFormatter } from "../formatters/archetypeFormatter.js";

export const listArchetypesToolDefinition = {
	title: "List Voice Archetypes",
	description:
		"Get a list of all available voice archetypes with their names and descriptions",
	inputSchema: {},
};

export const listArchetypesHandler =
	(archetypesData: ArchetypeData, archetypeFormatter: ArchetypeFormatter) =>
	async () => {
		try {
			const archetypes = archetypesData.archetypes.map((archetype) => ({
				name: archetype.archetype_name,
				description: archetype.description,
			}));

			const responseText = archetypeFormatter.formatArchetypeList(archetypes);

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
						text: `Error reading archetypes data: ${error instanceof Error ? error.message : "Unknown error"}`,
					},
				],
				isError: true,
			};
		}
	};
