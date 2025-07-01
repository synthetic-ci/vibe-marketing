import { z } from "zod";
export const listCopywritingFrameworksToolDefinition = {
    title: "List Copywriting Frameworks",
    description: "Get a list of available copywriting frameworks and their descriptions for a specific social media network",
    inputSchema: {
        network: z
            .string()
            .describe("Social media network (twitter, instagram, linkedin, tiktok, youtube, facebook)"),
    },
};
export const listCopywritingFrameworksHandler = (copywritingService) => async ({ network }) => {
    try {
        const responseText = copywritingService.formatFrameworksList(network);
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
                    text: `Error reading copywriting frameworks: ${error instanceof Error ? error.message : "Unknown error"}`,
                },
            ],
            isError: true,
        };
    }
};
