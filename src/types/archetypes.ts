export interface Archetype {
	archetype_name: string;
	description: string;
	tweet_style_examples: string[];
}

export interface ArchetypeData {
	archetypes: Archetype[];
}
