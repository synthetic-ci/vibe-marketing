import { z } from "zod";
export const getCopywritingFrameworkToolDefinition = {
    title: "Get Specific Copywriting Framework",
    description: "Get detailed information about a specific copywriting framework for a network",
    inputSchema: {
        network: z
            .string()
            .describe("Social media network (twitter, instagram, linkedin, tiktok, youtube, facebook)"),
        framework: z
            .string()
            .describe("Framework name (aida, pas, bab, 4cs, uuuu, pppp, slap, app, storybrand)"),
    },
};
export const getCopywritingFrameworkHandler = (copywritingService) => async ({ network, framework }) => {
    try {
        const responseText = copywritingService.formatFramework(network, framework);
        return {
            content: [
                {
                    type: "text",
                    text: responseText,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error reading copywriting framework: ${error instanceof Error ? error.message : "Unknown error"}`,
                },
            ],
            isError: true,
        };
    }
};
