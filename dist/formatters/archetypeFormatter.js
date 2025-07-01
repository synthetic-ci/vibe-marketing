export class ArchetypeFormatter {
    /**
     * Format an archetype for display with name, description, and tweet examples
     */
    formatArchetype(archetype) {
        const responseText = `## ${archetype.archetype_name}\n\n` +
            `**Description:** ${archetype.description}\n\n` +
            `**Tweet Style Examples:**\n` +
            archetype.tweet_style_examples
                .map((example, index) => `${index + 1}. "${example}"`)
                .join("\n");
        return responseText;
    }
    /**
     * Format a list of archetypes with their names and descriptions
     */
    formatArchetypeList(archetypes) {
        const responseText = `Available Voice Archetypes (${archetypes.length} total):\n\n` +
            archetypes
                .map((arch) => `• **${arch.name}**\n  ${arch.description}`)
                .join("\n\n");
        return responseText;
    }
}
