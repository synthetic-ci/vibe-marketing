import { beforeEach, describe, it, vi, expect as vitestExpected } from "vitest";

// biome-ignore lint: any type is needed for test compatibility
const expect = vitestExpected as any;

import type { CopywritingService } from "../../services/index.js";

import type { CopywritingFramework } from "../../types/copywriting.js";
import { getCopywritingFrameworkPrompt } from "../getCopywritingFrameworkPrompt.js";

// Mock CopywritingService
const mockCopywritingService = {
	getAvailableNetworks: vi.fn(),
	getNetworkFrameworks: vi.fn(),
	getFramework: vi.fn(),
	getNetworkData: vi.fn(),
} as unknown as CopywritingService;

describe("getCopywritingFrameworkPrompt", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const mockFrameworkData: CopywritingFramework = {
		title: "AIDA Framework for Twitter/X",
		components: [
			{
				name: "Attention",
				purpose: "Grab immediate attention",
				format: "Punchy opener",
				examples: ["Hook example"],
				note: "Must capture attention",
			},
			{
				name: "Interest",
				purpose: "Build curiosity",
				format: "Brief context",
				examples: ["Interest example"],
				note: "Must build curiosity",
			},
			{
				name: "Desire",
				purpose: "Show transformation",
				format: "Specific outcome",
				examples: ["Desire example"],
				note: "Must show transformation",
			},
			{
				name: "Action",
				purpose: "Drive engagement",
				format: "Simple CTA",
				examples: ["Action example"],
				note: "Must drive engagement",
			},
		],
	};

	const mockNetworkData = {
		name: "Twitter/X",
		aida: mockFrameworkData,
	};

	describe("prompt definition", () => {
		it("should return correct prompt definition", () => {
			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);

			expect(prompt.name).toBe("get-copywriting-framework");
			expect(prompt.definition.title).toBe("Get Copywriting Framework");
			expect(prompt.definition.description).toContain("copywriting frameworks");
			expect(prompt.definition.argsSchema).toHaveProperty("network");
			expect(prompt.definition.argsSchema).toHaveProperty("framework");
			expect(prompt.definition.argsSchema).toHaveProperty("context");
		});
	});

	describe("network completable", () => {
		it("should return filtered networks based on input", () => {
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
				"instagram",
				"linkedin",
				"tiktok",
			]);

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const networkCompletable = prompt.definition.argsSchema.network;

			if (
				typeof networkCompletable === "object" &&
				networkCompletable._def?.complete
			) {
				const completions = networkCompletable._def.complete("tw");
				expect(completions).toEqual(["twitter"]);
			}
		});

		it("should return all networks when no input provided", () => {
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
				"instagram",
				"linkedin",
			]);

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const networkCompletable = prompt.definition.argsSchema.network;

			if (
				typeof networkCompletable === "object" &&
				networkCompletable._def?.complete
			) {
				const completions = networkCompletable._def.complete("");
				expect(completions).toEqual(["twitter", "instagram", "linkedin"]);
			}
		});
	});

	describe("framework completable", () => {
		it("should return frameworks for selected network", () => {
			vi.mocked(mockCopywritingService.getNetworkFrameworks).mockReturnValue([
				"aida",
				"pas",
				"bab",
			]);

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const frameworkCompletable = prompt.definition.argsSchema.framework;

			if (
				typeof frameworkCompletable === "object" &&
				frameworkCompletable._def?.complete
			) {
				const completions = frameworkCompletable._def.complete("a", {
					arguments: { network: "twitter" },
				});
				expect(completions).toEqual(["aida"]);
			}

			expect(mockCopywritingService.getNetworkFrameworks).toHaveBeenCalledWith(
				"twitter",
			);
		});

		it("should return all unique frameworks when no network selected", () => {
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
				"instagram",
			]);
			vi.mocked(mockCopywritingService.getNetworkFrameworks)
				.mockReturnValueOnce(["aida", "pas"])
				.mockReturnValueOnce(["aida", "bab"]);

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const frameworkCompletable = prompt.definition.argsSchema.framework;

			if (
				typeof frameworkCompletable === "object" &&
				frameworkCompletable._def?.complete
			) {
				const completions = frameworkCompletable._def.complete("a");
				expect(completions).toEqual(["aida"]);
			}
		});
	});

	describe("handler", () => {
		it("should generate correct prompt when framework is specified", () => {
			vi.mocked(mockCopywritingService.getFramework).mockReturnValue(
				mockFrameworkData,
			);
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
				"instagram",
			]);
			vi.mocked(mockCopywritingService.getNetworkData)
				.mockReturnValueOnce(mockNetworkData)
				.mockReturnValueOnce({ name: "Instagram" });

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const result = prompt.handler({
				network: "twitter",
				framework: "aida",
				context: "Test context",
			});

			expect(result.messages).toHaveLength(1);
			expect(result.messages[0].role).toBe("user");
			expect(result.messages[0].content.text).toContain(
				"AIDA framework for twitter",
			);
			expect(result.messages[0].content.text).toContain(
				"Context: Test context",
			);
			expect(result.messages[0].content.text).toContain(
				"AIDA Framework for Twitter/X: Attention, Interest, Desire, Action",
			);
			expect(result.messages[0].content.text).toContain("**Twitter/X**:");
			expect(result.messages[0].content.text).toContain("**Instagram**:");
		});

		it("should generate correct prompt when no framework specified", () => {
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
				"instagram",
			]);
			vi.mocked(mockCopywritingService.getNetworkFrameworks)
				.mockReturnValueOnce(["aida", "pas"])
				.mockReturnValueOnce(["bab"]);
			vi.mocked(mockCopywritingService.getNetworkData)
				.mockReturnValueOnce(mockNetworkData)
				.mockReturnValueOnce({ name: "Instagram" });

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const result = prompt.handler({
				network: "twitter",
				framework: "",
			});

			expect(result.messages[0].content.text).toContain(
				"Available frameworks: aida, pas, bab",
			);
		});

		it("should handle framework not found in selected network", () => {
			vi.mocked(mockCopywritingService.getFramework)
				.mockReturnValueOnce(null) // Not found in twitter
				.mockReturnValueOnce(mockFrameworkData); // Found in instagram
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
				"instagram",
			]);
			vi.mocked(mockCopywritingService.getNetworkData)
				.mockReturnValueOnce(mockNetworkData)
				.mockReturnValueOnce({ name: "Instagram" });

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const result = prompt.handler({
				network: "twitter",
				framework: "aida",
			});

			expect(result.messages[0].content.text).toContain(
				"AIDA Framework for Twitter/X: Attention, Interest, Desire, Action",
			);
			expect(mockCopywritingService.getFramework).toHaveBeenCalledWith(
				"twitter",
				"aida",
			);
			expect(mockCopywritingService.getFramework).toHaveBeenCalledWith(
				"instagram",
				"aida",
			);
		});

		it("should handle framework not found anywhere", () => {
			vi.mocked(mockCopywritingService.getFramework).mockReturnValue(null);
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
				"instagram",
			]);
			vi.mocked(mockCopywritingService.getNetworkData)
				.mockReturnValueOnce(mockNetworkData)
				.mockReturnValueOnce({ name: "Instagram" });

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const result = prompt.handler({
				network: "twitter",
				framework: "unknown",
			});

			expect(result.messages[0].content.text).toContain(
				"UNKNOWN: Framework details available through the tool",
			);
		});

		it("should handle missing network data gracefully", () => {
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
				"unknown",
			]);
			vi.mocked(mockCopywritingService.getNetworkData)
				.mockReturnValueOnce(mockNetworkData)
				.mockReturnValueOnce(null);

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const result = prompt.handler({
				network: "twitter",
				framework: "aida",
			});

			expect(result.messages[0].content.text).toContain("**Twitter/X**:");
			expect(result.messages[0].content.text).toContain("**unknown**:");
		});

		it("should generate platform considerations for all networks", () => {
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
				"instagram",
				"linkedin",
				"tiktok",
				"youtube",
				"facebook",
				"unknown",
			]);
			vi.mocked(mockCopywritingService.getNetworkData)
				.mockReturnValueOnce({ name: "Twitter/X" })
				.mockReturnValueOnce({ name: "Instagram" })
				.mockReturnValueOnce({ name: "LinkedIn" })
				.mockReturnValueOnce({ name: "TikTok" })
				.mockReturnValueOnce({ name: "YouTube" })
				.mockReturnValueOnce({ name: "Facebook" })
				.mockReturnValueOnce(null);

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const result = prompt.handler({
				network: "",
				framework: "",
			});

			const text = result.messages[0].content.text;
			expect(text).toContain("**Twitter/X**: Brevity is key");
			expect(text).toContain("**Instagram**: Visual-first");
			expect(text).toContain("**LinkedIn**: Professional tone");
			expect(text).toContain("**TikTok**: Entertainment value");
			expect(text).toContain("**YouTube**: Longer form");
			expect(text).toContain("**Facebook**: Community-focused");
			expect(text).toContain(
				"**unknown**: Adapt framework to platform conventions",
			);
		});

		it("should not include context when not provided", () => {
			vi.mocked(mockCopywritingService.getAvailableNetworks).mockReturnValue([
				"twitter",
			]);
			vi.mocked(mockCopywritingService.getNetworkData).mockReturnValue(
				mockNetworkData,
			);

			const prompt = getCopywritingFrameworkPrompt(mockCopywritingService);
			const result = prompt.handler({
				network: "twitter",
				framework: "aida",
			});

			expect(result.messages[0].content.text).not.toContain("Context:");
		});
	});
});
