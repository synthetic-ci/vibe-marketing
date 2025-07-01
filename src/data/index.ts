// Import YAML files using Node.js fs module
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { ArchetypeData } from "../types/archetypes.js";
import type { CopywritingData, GeneralRules } from "../types/copywriting.js";
import type { HookData } from "../types/hooks.js";
import type { DoNotUseData } from "../types/humanizing.js";
import { parse as parseYaml } from "yaml";

// Get current directory - use process.cwd() as base for bundled environment
const getCurrentDir = () => {
	// In bundled/CJS environment, use process.cwd() and navigate to src
	return process.cwd();
};

// Helper function to load and parse YAML files
function loadYamlFile(relativePath: string): any {
	const currentDir = getCurrentDir();
	// Use direct path from project root
	const filePath = join(currentDir, relativePath);
	const content = readFileSync(filePath, 'utf-8');
	return parseYaml(content);
}

// Load YAML files (paths relative to project root)
const hooksYaml = loadYamlFile("src/content/hooks/social-media-hooks.yml");
const archetypesYaml = loadYamlFile("src/content/voicing/archetypes.yml");
const facebookCopywritingYaml = loadYamlFile("src/content/copywriting/facebook.yml");
const generalCopywritingYaml = loadYamlFile("src/content/copywriting/general.yml");
const instagramCopywritingYaml = loadYamlFile("src/content/copywriting/instagram.yml");
const linkedinCopywritingYaml = loadYamlFile("src/content/copywriting/linkedin.yml");
const tiktokCopywritingYaml = loadYamlFile("src/content/copywriting/tiktok.yml");
const twitterCopywritingYaml = loadYamlFile("src/content/copywriting/twitter.yml");
const youtubeCopywritingYaml = loadYamlFile("src/content/copywriting/youtube.yml");  
const doNotUseYaml = loadYamlFile("src/content/humanizing/doNotuse.yml");

// Parse YAML files once at module load to avoid repeated work per invocation
export const hooksData: HookData = hooksYaml as HookData;
export const archetypesData: ArchetypeData = archetypesYaml as ArchetypeData;

// Parse copywriting YAML files and combine into a single data structure
export const copywritingData: CopywritingData = {
	twitter: twitterCopywritingYaml.twitter,
	instagram: instagramCopywritingYaml.instagram,
	linkedin: linkedinCopywritingYaml.linkedin,
	tiktok: tiktokCopywritingYaml.tiktok,
	youtube: youtubeCopywritingYaml.youtube,
	facebook: facebookCopywritingYaml.facebook,
};
export const generalRules: GeneralRules = generalCopywritingYaml as GeneralRules;
export const doNotUseData: DoNotUseData = doNotUseYaml as DoNotUseData;
