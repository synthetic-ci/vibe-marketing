import { completable } from "@modelcontextprotocol/sdk/server/completable.js";
import { z } from "zod";
import type { CopywritingService } from "../services/index.js";

export function getCopywritingFrameworkPrompt(
	copywritingService: CopywritingService,
) {
	return {
		name: "get-copywriting-framework",
		definition: {
			title: "Get Copywriting Framework",
			description:
				"Guide for using specific copywriting frameworks tailored to different social media platforms",
			argsSchema: {
				network: completable(z.string(), (value = "") => {
					// Get available networks dynamically from copywriting data
					const networks = copywritingService.getAvailableNetworks();
					return networks.filter((n) =>
						n.toLowerCase().startsWith(value.toLowerCase()),
					);
				}),
				framework: completable(z.string(), (value = "", context) => {
					// Get available frameworks - either from a specific network or all frameworks
					const selectedNetwork = context?.arguments?.network;
					let frameworks: string[] = [];

					if (selectedNetwork) {
						// Get frameworks for the selected network
						frameworks =
							copywritingService.getNetworkFrameworks(selectedNetwork);
					} else {
						// Get all unique frameworks across all networks
						const allFrameworks = new Set<string>();
						copywritingService.getAvailableNetworks().forEach((network) => {
							copywritingService
								.getNetworkFrameworks(network)
								.forEach((framework) => {
									allFrameworks.add(framework);
								});
						});
						frameworks = Array.from(allFrameworks);
					}

					return frameworks.filter((f) =>
						f.toLowerCase().startsWith(value.toLowerCase()),
					);
				}),
				context: z
					.string()
					.optional()
					.describe("Your specific content or campaign context"),
			},
		},
		handler: ({
			network,
			framework,
			context,
		}: {
			network: string;
			framework: string;
			context?: string;
		}) => {
			// Get framework overview from copywriting service
			const getFrameworkOverview = () => {
				if (!framework) {
					// Get all unique frameworks across all networks
					const allFrameworks = new Set<string>();
					copywritingService.getAvailableNetworks().forEach((net) => {
						copywritingService.getNetworkFrameworks(net).forEach((fw) => {
							allFrameworks.add(fw);
						});
					});
					return (
						"Available frameworks: " + Array.from(allFrameworks).join(", ")
					);
				}

				// Try to get framework info from the selected network first, then fall back to any network
				let frameworkInfo = null;
				if (network) {
					frameworkInfo = copywritingService.getFramework(network, framework);
				}

				// If not found in selected network, try to find it in any network
				if (!frameworkInfo) {
					const networks = copywritingService.getAvailableNetworks();
					for (const net of networks) {
						// Skip the network we already checked
						if (net === network) continue;
						frameworkInfo = copywritingService.getFramework(net, framework);
						if (frameworkInfo) break;
					}
				}

				if (frameworkInfo && frameworkInfo.title) {
					const components = frameworkInfo.components || [];
					const componentSummary = components
						.map((comp: { name: string }) => comp.name)
						.join(", ");
					return `- ${frameworkInfo.title}: ${componentSummary}`;
				}

				// Fallback for unknown frameworks
				return `- ${framework.toUpperCase()}: Framework details available through the tool`;
			};

			// Get platform considerations from copywriting service
			const getPlatformConsiderations = () => {
				const networks = copywritingService.getAvailableNetworks();
				return networks
					.map((net) => {
						const networkData = copywritingService.getNetworkData(net);
						const name = networkData?.name || net;
						// Add some basic platform considerations (these could also be moved to the YAML files)
						const considerations: Record<string, string> = {
							twitter: "Brevity is key - adapt frameworks to 280 characters",
							instagram: "Visual-first - frameworks should complement imagery",
							linkedin: "Professional tone - focus on business value",
							tiktok: "Entertainment value - make frameworks fun and engaging",
							youtube: "Longer form - can use complete framework structure",
							facebook: "Community-focused - encourage discussion and sharing",
						};
						const consideration =
							considerations[net.toLowerCase()] ||
							"Adapt framework to platform conventions";
						return `- **${name}**: ${consideration}`;
					})
					.join("\n");
			};

			return {
				messages: [
					{
						role: "user" as const,
						content: {
							type: "text" as const,
							text: `I need help using the ${framework ? framework.toUpperCase() : "copywriting"} framework${network ? ` for ${network}` : ""}.

${context ? `Context: ${context}\n` : ""}
Please use the get-copywriting-framework tool to get detailed information about${framework ? ` the ${framework.toUpperCase()} framework` : " a specific framework"}${network ? ` for ${network}` : ""}.

Framework Overview:
${getFrameworkOverview()}

Platform Considerations:
${getPlatformConsiderations()}

Please provide the framework details and examples of how to apply it effectively.`,
						},
					},
				],
			};
		},
	};
}
