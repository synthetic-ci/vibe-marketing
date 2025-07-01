import type { ArchetypeData } from "@lib-types/archetypes.js";
import { z } from "zod";
import type { ArchetypeFormatter } from "../formatters/archetypeFormatter.js";

export const getArchetypeToolDefinition = {
	title: "Get Voice Archetype Details",
	description:
		"Get detailed information about a specific voice archetype including tweet examples",
	inputSchema: {
		name: z
			.string()
			.describe(
				"The archetype name (e.g., 'AUTHORITY', 'COMEDIAN', 'HUSTLER')",
			),
	},
};

export const getArchetypeHandler =
	(archetypesData: ArchetypeData, archetypeFormatter: ArchetypeFormatter) =>
	async ({ name }: { name: string }) => {
		try {
			const archetype = archetypesData.archetypes.find(
				(arch) => arch.archetype_name.toLowerCase() === name.toLowerCase(),
			);

			if (!archetype) {
				return {
					content: [
						{
							type: "text" as const,
							text: `Archetype "${name}" not found. Use the list-archetypes tool to see available options.`,
						},
					],
					isError: true,
				};
			}

			const responseText = archetypeFormatter.formatArchetype(archetype);

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
						text: `Error reading archetype data: ${error instanceof Error ? error.message : "Unknown error"}`,
					},
				],
				isError: true,
			};
		}
	};
