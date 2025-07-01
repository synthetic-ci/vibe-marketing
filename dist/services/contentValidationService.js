import { validateLinkedinBeforeFoldCharacterLimit, validateMetaBeforeFoldCharacterLimit, validateTiktokBeforeFoldCharacterLimit, validateTwitterBeforeFoldCharacterLimit, validateYoutubeDescriptionBeforeFoldCharacterLimit, validateYoutubeTitleBeforeFoldCharacterLimit, } from "../textUtils.js";
export class ContentValidationService {
    /**
     * Validate content against before-fold limits for each social media platform
     */
    validateContentBeforeFold(text, platform, contentType = "post") {
        let isValid = false;
        let validationMessage = "";
        const characterCount = text.length;
        switch (platform) {
            case "twitter":
                isValid = validateTwitterBeforeFoldCharacterLimit(text);
                validationMessage = isValid
                    ? "Content passes Twitter before-fold limit (280 characters)"
                    : "Content exceeds Twitter before-fold limit (280 characters)";
                break;
            case "instagram":
            case "facebook":
                isValid = validateMetaBeforeFoldCharacterLimit(text);
                validationMessage = isValid
                    ? `Content passes ${platform} before-fold limit (141 characters)`
                    : `Content exceeds ${platform} before-fold limit (141 characters)`;
                break;
            case "tiktok":
                isValid = validateTiktokBeforeFoldCharacterLimit(text);
                validationMessage = isValid
                    ? "Content passes TikTok before-fold limit (1000 characters)"
                    : "Content exceeds TikTok before-fold limit (1000 characters)";
                break;
            case "linkedin":
                isValid = validateLinkedinBeforeFoldCharacterLimit(text);
                validationMessage = isValid
                    ? "Content passes LinkedIn before-fold limits (210 characters, 3 lines)"
                    : "Content exceeds LinkedIn before-fold limits (210 characters, 3 lines)";
                break;
            case "youtube":
                if (contentType === "title") {
                    isValid = validateYoutubeTitleBeforeFoldCharacterLimit(text);
                    validationMessage = isValid
                        ? "YouTube title passes before-fold limit (70 characters)"
                        : "YouTube title exceeds before-fold limit (70 characters)";
                }
                else if (contentType === "description") {
                    isValid = validateYoutubeDescriptionBeforeFoldCharacterLimit(text);
                    validationMessage = isValid
                        ? "YouTube description passes before-fold limit (157 characters)"
                        : "YouTube description exceeds before-fold limit (157 characters)";
                }
                else {
                    isValid = validateYoutubeDescriptionBeforeFoldCharacterLimit(text);
                    validationMessage = isValid
                        ? "YouTube content passes before-fold limit (157 characters)"
                        : "YouTube content exceeds before-fold limit (157 characters)";
                }
                break;
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
        const result = {
            isValid,
            message: validationMessage,
            characterCount,
        };
        // Add line count for LinkedIn
        if (platform === "linkedin") {
            result.lineCount = text.split(/\r\n|\r|\n/).length;
        }
        return result;
    }
    /**
     * Format validation result into a user-friendly response string
     */
    formatValidationResult(result, platform, contentType = "post") {
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
        const contentTypeText = contentType !== "post" ? ` (${contentType})` : "";
        const statusIcon = result.isValid ? "✅" : "❌";
        let response = `**Validation Result for ${platformName}${contentTypeText}:**\n\n`;
        response += `${statusIcon} ${result.message}\n\n`;
        response += `**Character Count:** ${result.characterCount} characters`;
        if (result.lineCount !== undefined) {
            response += `\n**Line Count:** ${result.lineCount} lines`;
        }
        return response;
    }
}
