import {
	archetypesData,
	copywritingData,
	doNotUseData,
	generalRules,
	hooksData,
} from "./data/index.js";
import {
	ArchetypeFormatter,
	NetworkFormatter,
	TrendingContentFormatter,
	TruncatedTextFormatter,
} from "./formatters/index.js";
import {
	findSocialMediaHooksPrompt,
	getCopywritingFrameworkPrompt,
} from "./prompts/index.js";
import {
	createPhrasesToAvoidResource,
	createSocialMediaHooksResource,
} from "./resources/index.js";
import {
	ContentValidationService,
	CopywritingService,
	HookSearchService,
	TrendingContentService,
} from "./services/index.js";
import {
	findHooksHandler,
	findHooksToolDefinition,
	flagProblematicPhrasesHandler,
	flagProblematicPhrasesToolDefinition,
	getArchetypeHandler,
	getArchetypeToolDefinition,
	getCopywritingFrameworkHandler,
	getCopywritingFrameworkToolDefinition,
	getNetworkCategoriesHandler,
	getNetworkCategoriesToolDefinition,
	getTextBeforeFoldHandler,
	getTextBeforeFoldToolDefinition,
	getTrendingContentHandler,
	getTrendingContentToolDefinition,
	createValidatedTrendingContentHandler,
	listArchetypesHandler,
	listArchetypesToolDefinition,
	listCopywritingFrameworksHandler,
	listCopywritingFrameworksToolDefinition,
	validateContentBeforeFoldHandler,
	validateContentBeforeFoldToolDefinition,
} from "./tools/index.js";
// Init services
const hookSearchService = new HookSearchService(hooksData);
const trendingContentService = new TrendingContentService();
const trendingContentFormatter = new TrendingContentFormatter();
const archetypeFormatter = new ArchetypeFormatter();
const networkFormatter = new NetworkFormatter();
const copywritingService = new CopywritingService(
	copywritingData,
	generalRules,
);
const contentValidationService = new ContentValidationService();
const truncatedTextFormatter = new TruncatedTextFormatter();
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Optional: Define configuration schema to require configuration at connection time
export const configSchema = z.object({
  debug: z.boolean().default(false).describe("Enable debug logging"),
  hyperFeedApiKey: z.string().optional().describe("Your HyperFeed API key (optional)"),
});



export default function createStatelessServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  const server = new McpServer({
    name: "Vibe Marketing MCP (HyperFeed.ai)",
    version: "1.0.0",
  });

  console.log('Server config:', { 
    debug: config.debug, 
    hasApiKey: !!config.hyperFeedApiKey,
    apiKeyLength: config.hyperFeedApiKey?.length 
  });

  // Hooks tools - register find-hooks without API key validation
  server.registerTool(
    "find-hooks",
    findHooksToolDefinition,
    findHooksHandler(hookSearchService),
  );

  server.registerTool(
    "get-network-categories-for-hooks",
    getNetworkCategoriesToolDefinition,
    getNetworkCategoriesHandler(hooksData, networkFormatter),
  );

  // Copywriting tools
  server.registerTool(
    "list-copywriting-frameworks",
    listCopywritingFrameworksToolDefinition,
    listCopywritingFrameworksHandler(copywritingService),
  );

  server.registerTool(
    "get-copywriting-framework",
    getCopywritingFrameworkToolDefinition,
    getCopywritingFrameworkHandler(copywritingService),
  );

  // Archetype tools
  server.registerTool(
    "list-archetypes",
    listArchetypesToolDefinition,
    listArchetypesHandler(archetypesData, archetypeFormatter),
  );

  server.registerTool(
    "get-archetype",
    getArchetypeToolDefinition,
    getArchetypeHandler(archetypesData, archetypeFormatter),
  );

  // Content validation tools
  server.registerTool(
    "flag-problematic-phrases",
    flagProblematicPhrasesToolDefinition,
    flagProblematicPhrasesHandler(doNotUseData),
  );

  server.registerTool(
    "validate-content-before-fold",
    validateContentBeforeFoldToolDefinition,
    validateContentBeforeFoldHandler(contentValidationService),
  );

  server.registerTool(
    "get-text-before-fold",
    getTextBeforeFoldToolDefinition,
    getTextBeforeFoldHandler(truncatedTextFormatter),
  );

  // Trending content tool - register with API key validation
  server.registerTool(
    "get-trending-content",
    getTrendingContentToolDefinition,
    createValidatedTrendingContentHandler(trendingContentService, trendingContentFormatter, config.hyperFeedApiKey),
  );

  // ------------------------------------------------------------
		// Resources
		// ------------------------------------------------------------

		// Phrases to avoid resources
		const phrasesToAvoidResource = createPhrasesToAvoidResource(doNotUseData);
		server.registerResource(
			"phrases-to-avoid",
			phrasesToAvoidResource.uri,
			phrasesToAvoidResource.metadata,
			phrasesToAvoidResource.handler,
		);

		// Register resource for social media hooks
		const socialMediaHooksResource = createSocialMediaHooksResource(hooksData);
		server.registerResource(
			"social-media-hooks",
			socialMediaHooksResource.uri,
			socialMediaHooksResource.metadata,
			socialMediaHooksResource.handler,
		);

		// ------------------------------------------------------------
		// Prompts
		// ------------------------------------------------------------

		const socialMediaHooksPrompt = findSocialMediaHooksPrompt(hooksData);
		server.registerPrompt(
			socialMediaHooksPrompt.name,
			socialMediaHooksPrompt.definition,
			socialMediaHooksPrompt.handler,
		);

		const copywritingFrameworkPrompt =
			getCopywritingFrameworkPrompt(copywritingService);
		server.registerPrompt(
			copywritingFrameworkPrompt.name,
			copywritingFrameworkPrompt.definition,
			copywritingFrameworkPrompt.handler,
		);

  return server.server;
}
