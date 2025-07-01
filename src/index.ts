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
import { jwtVerify, createRemoteJWKSet } from 'jose';

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

const HYPERFEED_JWKS = createRemoteJWKSet(
  new URL('https://clerk.hyperfeed.ai/.well-known/jwks.json')
);

const CLERK_JWKS = createRemoteJWKSet(
  new URL('https://just-elephant-42.clerk.accounts.dev/.well-known/jwks.json')
);

async function validateHyperFeedApiKey(token: string): Promise<boolean> {
  // Try validating with HyperFeed JWKS first
  try {
    const { payload } = await jwtVerify(token, HYPERFEED_JWKS, {
      issuer: 'https://clerk.hyperfeed.ai',
      audience: 'hyperfeed.ai/api'
    });
	console.log('HyperFeed JWKS validation successful');
	console.log(payload);
    return true;
  } catch (hyperFeedError) {
    console.debug('HyperFeed JWKS validation failed, trying alternative endpoint:', hyperFeedError);
  }

  // Try validating with alternative Clerk JWKS
  try {
    const { payload } = await jwtVerify(token, CLERK_JWKS, {
      issuer: 'https://just-elephant-42.clerk.accounts.dev',
      audience: 'hyperfeed.ai/api'
    });
	console.log('Clerk JWKS validation successful');
	console.log(payload);
    return true;
  } catch (clerkError) {
    console.debug('Alternative Clerk JWKS validation failed:', clerkError);
  }

  console.error('HyperFeed API key validation failed with both JWKS endpoints');
  return false;
}

// Create a wrapper for the find hooks handler that includes JWT validation
function createValidatedFindHooksHandler(hookSearchService: any, apiKey: string) {
  return async (request: any) => {
    console.log('find-hooks tool called with request:', request);
    console.log('Validating API key...');
    
    const isValidKey = await validateHyperFeedApiKey(apiKey);
    if (!isValidKey) {
      console.error('JWT validation failed - throwing error');
      throw new Error('Invalid HyperFeed API key');
    }
    
    console.log('JWT validation successful - calling original handler');
    return findHooksHandler(hookSearchService)(request);
  };
}

export default function createStatelessServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  const server = new McpServer({
    name: "My MCP Server",
    version: "1.0.0",
  });

  console.log('Server config:', { 
    debug: config.debug, 
    hasApiKey: !!config.hyperFeedApiKey,
    apiKeyLength: config.hyperFeedApiKey?.length 
  });

  // Hooks tools - register find-hooks with JWT validation
  if (config.hyperFeedApiKey) {
    console.log('Registering find-hooks tool with API key validation');
    server.registerTool(
      "find-hooks",
      findHooksToolDefinition,
      createValidatedFindHooksHandler(hookSearchService, config.hyperFeedApiKey),
    );
  } else {
    console.log('No HyperFeed API key provided - find-hooks tool will not be available');
  }

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

  // Trending content tool
  server.registerTool(
    "get-trending-content",
    getTrendingContentToolDefinition,
    getTrendingContentHandler(trendingContentService, trendingContentFormatter),
  );

  return server.server;
}
