// Import YAML files using Node.js fs module
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import type { ArchetypeData } from "../types/archetypes.js";
import type {
	CopywritingData,
	GeneralRules,
	NetworkCopywriting,
} from "../types/copywriting.js";
import type { HookData } from "../types/hooks.js";
import type { DoNotUseData } from "../types/humanizing.js";

// Get current directory - use process.cwd() as base for bundled environment
const getCurrentDir = () => {
	// In bundled/CJS environment, use process.cwd() and navigate to src
	return process.cwd();
};

/**
 * Helper function to load and parse YAML files
 * @param relativePath - Path to the YAML file relative to the project root
 * @returns The value will match the type of the root value of the parsed YAML document, so Maps become objects, Sequences arrays, and scalars result in nulls, booleans, numbers and strings.
 */
function loadYamlFile<
	T =
		| HookData
		| ArchetypeData
		| NetworkCopywriting
		| GeneralRules
		| DoNotUseData,
>(relativePath: string): T {
	const currentDir = getCurrentDir();
	// Use direct path from project root
	const filePath = join(currentDir, relativePath);
	const content = readFileSync(filePath, "utf-8");
	return parseYaml(content) as T;
}

// Load YAML files (paths relative to project root)
const hooksYaml = loadYamlFile(
	"src/content/hooks/social-media-hooks.yml",
) as HookData;
const archetypesYaml = loadYamlFile(
	"src/content/voicing/archetypes.yml",
) as ArchetypeData;
const facebookCopywritingYaml = loadYamlFile(
	"src/content/copywriting/facebook.yml",
) as { facebook: NetworkCopywriting };
const generalCopywritingYaml = loadYamlFile(
	"src/content/copywriting/general.yml",
) as GeneralRules;
const instagramCopywritingYaml = loadYamlFile(
	"src/content/copywriting/instagram.yml",
) as { instagram: NetworkCopywriting };
const linkedinCopywritingYaml = loadYamlFile(
	"src/content/copywriting/linkedin.yml",
) as { linkedin: NetworkCopywriting };
const tiktokCopywritingYaml = loadYamlFile(
	"src/content/copywriting/tiktok.yml",
) as { tiktok: NetworkCopywriting };
const twitterCopywritingYaml = loadYamlFile(
	"src/content/copywriting/twitter.yml",
) as { twitter: NetworkCopywriting };
const youtubeCopywritingYaml = loadYamlFile(
	"src/content/copywriting/youtube.yml",
) as { youtube: NetworkCopywriting };
const doNotUseYaml = loadYamlFile(
	"src/content/humanizing/doNotuse.yml",
) as DoNotUseData;

// Parse YAML files once at module load to avoid repeated work per invocation
export const hooksData: HookData = hooksYaml;
export const archetypesData: ArchetypeData = archetypesYaml;

// Parse copywriting YAML files and combine into a single data structure
export const copywritingData: CopywritingData = {
	twitter: twitterCopywritingYaml.twitter,
	instagram: instagramCopywritingYaml.instagram,
	linkedin: linkedinCopywritingYaml.linkedin,
	tiktok: tiktokCopywritingYaml.tiktok,
	youtube: youtubeCopywritingYaml.youtube,
	facebook: facebookCopywritingYaml.facebook,
};
export const generalRules: GeneralRules = generalCopywritingYaml;
export const doNotUseData: DoNotUseData = doNotUseYaml;
