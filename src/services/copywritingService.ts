import type {
	CopywritingData,
	CopywritingFramework,
	GeneralRules,
	NetworkCopywriting,
} from "../types/copywriting.js";

export class CopywritingService {
	private copywritingData: CopywritingData;
	private generalRules: GeneralRules;

	constructor(copywritingData: CopywritingData, generalRules: GeneralRules) {
		this.copywritingData = copywritingData;
		this.generalRules = generalRules;
	}

	/**
	 * Get available networks
	 */
	getAvailableNetworks(): string[] {
		return Object.keys(this.copywritingData);
	}

	/**
	 * Get network data by network name
	 */
	getNetworkData(network: string): NetworkCopywriting | null {
		const networkKey = network.toLowerCase();
		return this.copywritingData[networkKey] || null;
	}

	/**
	 * Get available frameworks for a network
	 */
	getNetworkFrameworks(network: string): string[] {
		const networkData = this.getNetworkData(network);
		if (!networkData) return [];

		const frameworks: string[] = [];
		const frameworkKeys = [
			"aida",
			"pas",
			"bab",
			"4cs",
			"uuuu",
			"pppp",
			"slap",
			"app",
			"storybrand",
		];

		frameworkKeys.forEach((key) => {
			if (networkData[key as keyof NetworkCopywriting]) {
				frameworks.push(key);
			}
		});

		return frameworks;
	}

	/**
	 * Get specific framework for a network
	 */
	getFramework(
		network: string,
		framework: string,
	): CopywritingFramework | null {
		const networkData = this.getNetworkData(network);
		if (!networkData) return null;

		const frameworkKey = framework.toLowerCase() as keyof NetworkCopywriting;
		const frameworkData = networkData[frameworkKey];

		return frameworkData &&
			typeof frameworkData === "object" &&
			"title" in frameworkData
			? (frameworkData as CopywritingFramework)
			: null;
	}

	/**
	 * Format network copywriting data for display
	 */
	formatNetworkCopywriting(network: string): string {
		const networkData = this.getNetworkData(network);
		if (!networkData) {
			return `Network "${network}" not found. Available networks: ${this.getAvailableNetworks().join(", ")}`;
		}

		let result = `# ${networkData.name} Copywriting Frameworks\n\n`;

		// Add available frameworks
		const frameworks = this.getNetworkFrameworks(network);
		if (frameworks.length > 0) {
			result += `## Available Frameworks:\n`;
			frameworks.forEach((framework) => {
				const frameworkData = this.getFramework(network, framework);
				if (frameworkData) {
					result += `- **${framework.toUpperCase()}**: ${frameworkData.title}\n`;
				}
			});
			result += "\n";
		}

		// Add formatting checklist if available
		if (
			networkData.formatting_checklist &&
			networkData.formatting_checklist.length > 0
		) {
			result += `## Formatting Guidelines:\n`;
			networkData.formatting_checklist.forEach((rule) => {
				result += `- ${rule}\n`;
			});
			result += "\n";
		}

		// Add general rules footer
		result += this.getGeneralRulesFooter();

		return result;
	}

	/**
	 * Format only the frameworks list for a network (no formatting guidelines or general rules)
	 */
	formatFrameworksList(network: string): string {
		const networkData = this.getNetworkData(network);
		if (!networkData) {
			return `Network "${network}" not found. Available networks: ${this.getAvailableNetworks().join(", ")}`;
		}

		let result = `# ${networkData.name} - Available Copywriting Frameworks\n\n`;

		const frameworks = this.getNetworkFrameworks(network);
		if (frameworks.length > 0) {
			frameworks.forEach((framework) => {
				const frameworkData = this.getFramework(network, framework);
				if (frameworkData) {
					result += `## ${framework.toUpperCase()}\n`;
					result += `${frameworkData.title}\n\n`;
				}
			});
		} else {
			result += `No copywriting frameworks available for ${networkData.name}.\n`;
		}

		return result;
	}

	/**
	 * Format specific framework for display
	 */
	formatFramework(network: string, framework: string): string {
		const frameworkData = this.getFramework(network, framework);
		if (!frameworkData) {
			const availableFrameworks = this.getNetworkFrameworks(network);
			return `Framework "${framework}" not found for ${network}. Available frameworks: ${availableFrameworks.join(", ")}`;
		}

		const networkData = this.getNetworkData(network);
		let result = `# ${frameworkData.title}\n`;
		if (networkData) {
			result += `*For ${networkData.name}*\n\n`;
		}

		frameworkData.components.forEach((component, index) => {
			result += `## ${index + 1}. ${component.name}\n`;
			result += `**Purpose:** ${component.purpose}\n`;
			result += `**Format:** ${component.format}\n\n`;

			if (component.examples && component.examples.length > 0) {
				result += `**Examples:**\n`;
				component.examples.forEach((example) => {
					result += `- "${example}"\n`;
				});
				result += "\n";
			}

			if (component.note) {
				result += `*Note: ${component.note}*\n\n`;
			}
		});

		// Add general rules footer
		result += this.getGeneralRulesFooter();

		return result;
	}

	/**
	 * Get general copywriting rules
	 */
	getGeneralRules(): string {
		let result = `# General Copywriting Rules\n\n`;
		this.generalRules.general_rules.forEach((rule) => {
			result += `- ${rule}\n`;
		});
		return result;
	}

	/**
	 * Get general rules footer for appending to responses
	 */
	private getGeneralRulesFooter(): string {
		let footer = `\n---\n\n## 📋 General Copywriting Rules\n\n`;
		this.generalRules.general_rules.forEach((rule) => {
			footer += `- ${rule}\n`;
		});
		return footer;
	}
}
