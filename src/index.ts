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
	listArchetypesHandler,
	listArchetypesToolDefinition,
	listCopywritingFrameworksHandler,
	listCopywritingFrameworksToolDefinition,
	validateContentBeforeFoldHandler,
	validateContentBeforeFoldToolDefinition,
} from "./tools/index.js";
import type { UserProps } from "./types/auth";

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
    name: "My MCP Server",
    version: "1.0.0",
  });

  // Hooks tools - only register find-hooks if HyperFeed API key is provided
  if (config.hyperFeedApiKey) {
    server.registerTool(
      "find-hooks",
      findHooksToolDefinition,
      findHooksHandler(hookSearchService),
    );
  }

  server.registerTool(
    "get-network-categories-for-hooks",
    getNetworkCategoriesToolDefinition,
    getNetworkCategoriesHandler(hooksData, networkFormatter),
  );

  return server.server;
}
