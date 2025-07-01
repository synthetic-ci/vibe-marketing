import { beforeEach, describe, it, expect as vitestExpected } from "vitest";

// biome-ignore lint: any type is needed for test compatibility
const expect = vitestExpected as any;

import type { ContentType, SocialPlatform } from "../../textUtils.js";
import {
	ContentValidationService,
	type ValidationResult,
} from "../contentValidationService.js";

describe("ContentValidationService", () => {
	let service: ContentValidationService;

	beforeEach(() => {
		service = new ContentValidationService();
	});

	describe("validateContentBeforeFold", () => {
		describe("Twitter validation", () => {
			it("should validate content within Twitter's 280 character limit", () => {
				const text = "This is a short tweet that should pass validation.";
				const result = service.validateContentBeforeFold(text, "twitter");

				expect(result.isValid).toBe(true);
				expect(result.message).toContain(
					"Content passes Twitter before-fold limit",
				);
				expect(result.characterCount).toBe(text.length);
				expect(result.lineCount).toBeUndefined();
			});

			it("should invalidate content exceeding Twitter's 280 character limit", () => {
				const text = "a".repeat(281);
				const result = service.validateContentBeforeFold(text, "twitter");

				expect(result.isValid).toBe(false);
				expect(result.message).toContain(
					"Content exceeds Twitter before-fold limit",
				);
				expect(result.characterCount).toBe(281);
			});

			it("should handle content exactly at Twitter's limit", () => {
				const text = "a".repeat(280);
				const result = service.validateContentBeforeFold(text, "twitter");

				expect(result.isValid).toBe(true);
				expect(result.characterCount).toBe(280);
			});

			it("should handle empty content for Twitter", () => {
				const result = service.validateContentBeforeFold("", "twitter");

				expect(result.isValid).toBe(true);
				expect(result.characterCount).toBe(0);
			});
		});

		describe("Instagram validation", () => {
			it("should validate content within Instagram's 141 character limit", () => {
				const text = "This is a short Instagram post.";
				const result = service.validateContentBeforeFold(text, "instagram");

				expect(result.isValid).toBe(true);
				expect(result.message).toContain(
					"Content passes instagram before-fold limit (141 characters)",
				);
				expect(result.characterCount).toBe(text.length);
			});

			it("should invalidate content exceeding Instagram's 141 character limit", () => {
				const text = "a".repeat(142);
				const result = service.validateContentBeforeFold(text, "instagram");

				expect(result.isValid).toBe(false);
				expect(result.message).toContain(
					"Content exceeds instagram before-fold limit (141 characters)",
				);
				expect(result.characterCount).toBe(142);
			});

			it("should handle content exactly at Instagram's limit", () => {
				const text = "a".repeat(141);
				const result = service.validateContentBeforeFold(text, "instagram");

				expect(result.isValid).toBe(true);
				expect(result.characterCount).toBe(141);
			});
		});

		describe("Facebook validation", () => {
			it("should validate content within Facebook's 141 character limit", () => {
				const text = "This is a short Facebook post.";
				const result = service.validateContentBeforeFold(text, "facebook");

				expect(result.isValid).toBe(true);
				expect(result.message).toContain(
					"Content passes facebook before-fold limit (141 characters)",
				);
				expect(result.characterCount).toBe(text.length);
			});

			it("should invalidate content exceeding Facebook's 141 character limit", () => {
				const text = "a".repeat(142);
				const result = service.validateContentBeforeFold(text, "facebook");

				expect(result.isValid).toBe(false);
				expect(result.message).toContain(
					"Content exceeds facebook before-fold limit (141 characters)",
				);
				expect(result.characterCount).toBe(142);
			});
		});

		describe("TikTok validation", () => {
			it("should validate content within TikTok's 1000 character limit", () => {
				const text = "This is a TikTok post with hashtags #trending #fyp";
				const result = service.validateContentBeforeFold(text, "tiktok");

				expect(result.isValid).toBe(true);
				expect(result.message).toContain(
					"Content passes TikTok before-fold limit (1000 characters)",
				);
				expect(result.characterCount).toBe(text.length);
			});

			it("should invalidate content exceeding TikTok's 1000 character limit", () => {
				const text = "a".repeat(1001);
				const result = service.validateContentBeforeFold(text, "tiktok");

				expect(result.isValid).toBe(false);
				expect(result.message).toContain(
					"Content exceeds TikTok before-fold limit (1000 characters)",
				);
				expect(result.characterCount).toBe(1001);
			});

			it("should handle content exactly at TikTok's limit", () => {
				const text = "a".repeat(1000);
				const result = service.validateContentBeforeFold(text, "tiktok");

				expect(result.isValid).toBe(true);
				expect(result.characterCount).toBe(1000);
			});
		});

		describe("LinkedIn validation", () => {
			it("should validate content within LinkedIn's 210 character and 3 line limits", () => {
				const text = "This is line 1\nThis is line 2\nThis is line 3";
				const result = service.validateContentBeforeFold(text, "linkedin");

				expect(result.isValid).toBe(true);
				expect(result.message).toContain(
					"Content passes LinkedIn before-fold limits (210 characters, 3 lines)",
				);
				expect(result.characterCount).toBe(text.length);
				expect(result.lineCount).toBe(3);
			});

			it("should invalidate content exceeding LinkedIn's character limit", () => {
				const text = "a".repeat(211);
				const result = service.validateContentBeforeFold(text, "linkedin");

				expect(result.isValid).toBe(false);
				expect(result.message).toContain(
					"Content exceeds LinkedIn before-fold limits (210 characters, 3 lines)",
				);
				expect(result.characterCount).toBe(211);
				expect(result.lineCount).toBe(1);
			});

			it("should invalidate content exceeding LinkedIn's line limit", () => {
				const text = "Line 1\nLine 2\nLine 3\nLine 4";
				const result = service.validateContentBeforeFold(text, "linkedin");

				expect(result.isValid).toBe(false);
				expect(result.message).toContain(
					"Content exceeds LinkedIn before-fold limits (210 characters, 3 lines)",
				);
				expect(result.lineCount).toBe(4);
			});

			it("should handle different line ending formats for LinkedIn", () => {
				const textCRLF = "Line 1\r\nLine 2\r\nLine 3";
				const textCR = "Line 1\rLine 2\rLine 3";
				const textLF = "Line 1\nLine 2\nLine 3";

				const resultCRLF = service.validateContentBeforeFold(
					textCRLF,
					"linkedin",
				);
				const resultCR = service.validateContentBeforeFold(textCR, "linkedin");
				const resultLF = service.validateContentBeforeFold(textLF, "linkedin");

				expect(resultCRLF.lineCount).toBe(3);
				expect(resultCR.lineCount).toBe(3);
				expect(resultLF.lineCount).toBe(3);
			});

			it("should handle single line content for LinkedIn", () => {
				const text = "This is a single line post for LinkedIn";
				const result = service.validateContentBeforeFold(text, "linkedin");

				expect(result.isValid).toBe(true);
				expect(result.lineCount).toBe(1);
			});

			it("should handle content exactly at LinkedIn's limits", () => {
				const text = "a".repeat(210);
				const result = service.validateContentBeforeFold(text, "linkedin");

				expect(result.isValid).toBe(true);
				expect(result.characterCount).toBe(210);
				expect(result.lineCount).toBe(1);
			});
		});

		describe("YouTube validation", () => {
			it("should validate YouTube title within 70 character limit", () => {
				const text = "Amazing Video Title";
				const result = service.validateContentBeforeFold(
					text,
					"youtube",
					"title",
				);

				expect(result.isValid).toBe(true);
				expect(result.message).toContain(
					"YouTube title passes before-fold limit (70 characters)",
				);
				expect(result.characterCount).toBe(text.length);
			});

			it("should invalidate YouTube title exceeding 70 character limit", () => {
				const text = "a".repeat(71);
				const result = service.validateContentBeforeFold(
					text,
					"youtube",
					"title",
				);

				expect(result.isValid).toBe(false);
				expect(result.message).toContain(
					"YouTube title exceeds before-fold limit (70 characters)",
				);
				expect(result.characterCount).toBe(71);
			});

			it("should validate YouTube description within 157 character limit", () => {
				const text =
					"This is a great video description with lots of helpful information.";
				const result = service.validateContentBeforeFold(
					text,
					"youtube",
					"description",
				);

				expect(result.isValid).toBe(true);
				expect(result.message).toContain(
					"YouTube description passes before-fold limit (157 characters)",
				);
				expect(result.characterCount).toBe(text.length);
			});

			it("should invalidate YouTube description exceeding 157 character limit", () => {
				const text = "a".repeat(158);
				const result = service.validateContentBeforeFold(
					text,
					"youtube",
					"description",
				);

				expect(result.isValid).toBe(false);
				expect(result.message).toContain(
					"YouTube description exceeds before-fold limit (157 characters)",
				);
				expect(result.characterCount).toBe(158);
			});

			it("should default to description limit for generic YouTube post", () => {
				const text = "Generic YouTube content";
				const result = service.validateContentBeforeFold(
					text,
					"youtube",
					"post",
				);

				expect(result.isValid).toBe(true);
				expect(result.message).toContain(
					"YouTube content passes before-fold limit (157 characters)",
				);
			});

			it("should default to description limit when no content type specified", () => {
				const text = "Generic YouTube content";
				const result = service.validateContentBeforeFold(text, "youtube");

				expect(result.isValid).toBe(true);
				expect(result.message).toContain(
					"YouTube content passes before-fold limit (157 characters)",
				);
			});

			it("should handle content exactly at YouTube title limit", () => {
				const text = "a".repeat(70);
				const result = service.validateContentBeforeFold(
					text,
					"youtube",
					"title",
				);

				expect(result.isValid).toBe(true);
				expect(result.characterCount).toBe(70);
			});

			it("should handle content exactly at YouTube description limit", () => {
				const text = "a".repeat(157);
				const result = service.validateContentBeforeFold(
					text,
					"youtube",
					"description",
				);

				expect(result.isValid).toBe(true);
				expect(result.characterCount).toBe(157);
			});
		});

		describe("Error handling", () => {
			it("should throw error for unsupported platform", () => {
				expect(() => {
					service.validateContentBeforeFold(
						"test",
						"unsupported" as SocialPlatform,
					);
				}).toThrow("Unsupported platform: unsupported");
			});
		});

		describe("Edge cases", () => {
			it("should handle empty strings for all platforms", () => {
				const platforms: SocialPlatform[] = [
					"twitter",
					"instagram",
					"facebook",
					"tiktok",
					"linkedin",
					"youtube",
				];

				for (const platform of platforms) {
					const result = service.validateContentBeforeFold("", platform);
					expect(result.isValid).toBe(true);
					expect(result.characterCount).toBe(0);
				}
			});

			it("should handle whitespace-only content", () => {
				const text = "   \n  \t  ";
				const result = service.validateContentBeforeFold(text, "twitter");

				expect(result.isValid).toBe(true);
				expect(result.characterCount).toBe(text.length);
			});

			it("should handle special characters and emojis", () => {
				const text = "Test with emojis 🚀🎉 and special chars @#$%";
				const result = service.validateContentBeforeFold(text, "twitter");

				expect(result.isValid).toBe(true);
				expect(result.characterCount).toBe(text.length);
			});
		});
	});

	describe("formatValidationResult", () => {
		it("should format valid result correctly", () => {
			const result: ValidationResult = {
				isValid: true,
				message: "Content passes Twitter before-fold limit (280 characters)",
				characterCount: 50,
			};

			const formatted = service.formatValidationResult(result, "twitter");

			expect(formatted).toContain("**Validation Result for Twitter:**");
			expect(formatted).toContain(
				"✅ Content passes Twitter before-fold limit",
			);
			expect(formatted).toContain("**Character Count:** 50 characters");
			expect(formatted).not.toContain("Line Count");
		});

		it("should format invalid result correctly", () => {
			const result: ValidationResult = {
				isValid: false,
				message: "Content exceeds Instagram before-fold limit (141 characters)",
				characterCount: 150,
			};

			const formatted = service.formatValidationResult(result, "instagram");

			expect(formatted).toContain("**Validation Result for Instagram:**");
			expect(formatted).toContain(
				"❌ Content exceeds Instagram before-fold limit",
			);
			expect(formatted).toContain("**Character Count:** 150 characters");
		});

		it("should format result with content type correctly", () => {
			const result: ValidationResult = {
				isValid: true,
				message: "YouTube title passes before-fold limit (70 characters)",
				characterCount: 35,
			};

			const formatted = service.formatValidationResult(
				result,
				"youtube",
				"title",
			);

			expect(formatted).toContain("**Validation Result for Youtube (title):**");
			expect(formatted).toContain("✅ YouTube title passes before-fold limit");
		});

		it("should include line count for LinkedIn results", () => {
			const result: ValidationResult = {
				isValid: true,
				message:
					"Content passes LinkedIn before-fold limits (210 characters, 3 lines)",
				characterCount: 45,
				lineCount: 2,
			};

			const formatted = service.formatValidationResult(result, "linkedin");

			expect(formatted).toContain("**Validation Result for Linkedin:**");
			expect(formatted).toContain("**Character Count:** 45 characters");
			expect(formatted).toContain("**Line Count:** 2 lines");
		});

		it("should capitalize platform names correctly", () => {
			const result: ValidationResult = {
				isValid: true,
				message: "Test message",
				characterCount: 10,
			};

			const platforms: { platform: SocialPlatform; expected: string }[] = [
				{ platform: "twitter", expected: "Twitter" },
				{ platform: "instagram", expected: "Instagram" },
				{ platform: "facebook", expected: "Facebook" },
				{ platform: "tiktok", expected: "Tiktok" },
				{ platform: "linkedin", expected: "Linkedin" },
				{ platform: "youtube", expected: "Youtube" },
			];

			for (const { platform, expected } of platforms) {
				const formatted = service.formatValidationResult(result, platform);
				expect(formatted).toContain(`**Validation Result for ${expected}:**`);
			}
		});

		it("should handle different content types correctly", () => {
			const result: ValidationResult = {
				isValid: true,
				message: "Test message",
				characterCount: 10,
			};

			const contentTypes: { type: ContentType; expected: string }[] = [
				{ type: "post", expected: "**Validation Result for Twitter:**" },
				{
					type: "title",
					expected: "**Validation Result for Twitter (title):**",
				},
				{
					type: "description",
					expected: "**Validation Result for Twitter (description):**",
				},
			];

			for (const { type, expected } of contentTypes) {
				const formatted = service.formatValidationResult(
					result,
					"twitter",
					type,
				);
				expect(formatted).toContain(expected);
			}
		});

		it("should handle result without line count", () => {
			const result: ValidationResult = {
				isValid: true,
				message: "Test message",
				characterCount: 25,
			};

			const formatted = service.formatValidationResult(result, "twitter");

			expect(formatted).toContain("**Character Count:** 25 characters");
			expect(formatted).not.toContain("Line Count");
		});
	});
});
