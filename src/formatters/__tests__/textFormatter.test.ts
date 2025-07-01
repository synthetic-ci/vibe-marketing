import { beforeEach, describe, it, expect as vitestExpected } from "vitest";

// biome-ignore lint: any type is needed for test compatibility
const expect = vitestExpected as any;

import type { ContentType, SocialPlatform } from "../../textUtils.js";
import { TruncatedTextFormatter } from "../textFormatter.js";

describe("TruncatedTextFormatter", () => {
	let formatter: TruncatedTextFormatter;

	beforeEach(() => {
		formatter = new TruncatedTextFormatter();
	});

	describe("formatTruncatedText", () => {
		it("should format truncated text for Twitter correctly", () => {
			const truncatedText =
				"This is a sample tweet that has been truncated to fit within Twitter's character limit...";
			const platform: SocialPlatform = "twitter";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Twitter:**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 89 characters");
		});

		it("should format truncated text for Instagram correctly", () => {
			const truncatedText = "Beautiful sunset photo with inspiring caption...";
			const platform: SocialPlatform = "instagram";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Instagram:**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 48 characters");
		});

		it("should format truncated text for LinkedIn correctly", () => {
			const truncatedText =
				"Professional insight about industry trends and market analysis";
			const platform: SocialPlatform = "linkedin";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Linkedin:**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 62 characters");
		});

		it("should format truncated text for Facebook correctly", () => {
			const truncatedText =
				"Family update with photos from our weekend adventure";
			const platform: SocialPlatform = "facebook";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Facebook:**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 52 characters");
		});

		it("should format truncated text for TikTok correctly", () => {
			const truncatedText =
				"Viral dance challenge tutorial - step by step guide";
			const platform: SocialPlatform = "tiktok";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Tiktok:**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 51 characters");
		});

		it("should format truncated text for YouTube correctly", () => {
			const truncatedText = "How to make the perfect coffee at home";
			const platform: SocialPlatform = "youtube";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Youtube:**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 38 characters");
		});

		it("should include content type in label when specified", () => {
			const truncatedText = "Amazing tutorial content";
			const platform: SocialPlatform = "youtube";
			const contentType: ContentType = "title";

			const result = formatter.formatTruncatedText(
				truncatedText,
				platform,
				contentType,
			);

			expect(result).toContain("**Truncated Text for Youtube (title):**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 24 characters");
		});

		it("should include content type description in label", () => {
			const truncatedText =
				"Detailed description of the video content and what viewers can expect to learn";
			const platform: SocialPlatform = "youtube";
			const contentType: ContentType = "description";

			const result = formatter.formatTruncatedText(
				truncatedText,
				platform,
				contentType,
			);

			expect(result).toContain("**Truncated Text for Youtube (description):**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 78 characters");
		});

		it("should not include content type when it's 'post'", () => {
			const truncatedText = "Regular post content";
			const platform: SocialPlatform = "instagram";
			const contentType: ContentType = "post";

			const result = formatter.formatTruncatedText(
				truncatedText,
				platform,
				contentType,
			);

			expect(result).toContain("**Truncated Text for Instagram:**");
			expect(result).not.toContain("(post)");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 20 characters");
		});

		it("should handle empty truncated text", () => {
			const truncatedText = "";
			const platform: SocialPlatform = "twitter";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Twitter:**");
			expect(result).toContain("**Character Count:** 0 characters");
		});

		it("should handle special characters in truncated text", () => {
			const truncatedText = "Special chars: @#$%^&*()! 🚀 ✨ 💡";
			const platform: SocialPlatform = "twitter";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Twitter:**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 33 characters");
		});

		it("should handle line breaks in truncated text", () => {
			const truncatedText = "Line one\nLine two\nLine three";
			const platform: SocialPlatform = "linkedin";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Linkedin:**");
			expect(result).toContain("Line one\nLine two\nLine three");
			expect(result).toContain("**Character Count:** 28 characters");
		});

		it("should handle URLs in truncated text", () => {
			const truncatedText = "Check out this link: https://example.com/article";
			const platform: SocialPlatform = "twitter";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Twitter:**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 48 characters");
		});

		it("should properly capitalize platform names", () => {
			const truncatedText = "Test text";

			const platforms: SocialPlatform[] = [
				"twitter",
				"instagram",
				"facebook",
				"tiktok",
				"linkedin",
				"youtube",
			];
			const expectedCapitalizations = [
				"Twitter",
				"Instagram",
				"Facebook",
				"Tiktok",
				"Linkedin",
				"Youtube",
			];

			platforms.forEach((platform, index) => {
				const result = formatter.formatTruncatedText(truncatedText, platform);
				expect(result).toContain(
					`**Truncated Text for ${expectedCapitalizations[index]}:**`,
				);
			});
		});

		it("should maintain proper markdown formatting structure", () => {
			const truncatedText = "Sample text for formatting test";
			const platform: SocialPlatform = "instagram";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			// Check that the result follows the expected structure
			const lines = result.split("\n");
			expect(lines[0]).toBe("**Truncated Text for Instagram:**");
			expect(lines[1]).toBe("");
			expect(lines[2]).toBe(truncatedText);
			expect(lines[3]).toBe("");
			expect(lines[4]).toBe("**Character Count:** 31 characters");
		});

		it("should handle very long truncated text", () => {
			const truncatedText = "a".repeat(1000); // 1000 character string
			const platform: SocialPlatform = "tiktok";

			const result = formatter.formatTruncatedText(truncatedText, platform);

			expect(result).toContain("**Truncated Text for Tiktok:**");
			expect(result).toContain(truncatedText);
			expect(result).toContain("**Character Count:** 1000 characters");
		});
	});
});
