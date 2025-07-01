/**
 * Get the character length of a tweet according to Twitter's counting rules.
 *
 * This implements Twitter's character counting logic:
 * - URLs count as 23 characters
 * - Emoji count as 2 characters
 * - CJK characters count as 2 characters
 * - Most other characters count as 1 character
 */
export function getTweetCharacterLength(text) {
    // Normalize to NFC form as Twitter does
    const normalizedText = text.normalize("NFC");
    // Replace URLs with 23 'x' characters (Twitter's t.co URL length)
    const processedText = normalizedText.replace(/https?:\/\/\S+/g, "x".repeat(23));
    let count = 0;
    // Regex for emoji detection (simplified version)
    const emojiPattern = /[\u{1F000}-\u{1F9FF}]|[\u{1F000}-\u{1F9FF}][\u200D\uFE0F\u{1F000}-\u{1F9FF}]*/gu;
    // Regex for CJK character ranges
    const cjkPattern = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\uf900-\ufaff]/g;
    let i = 0;
    while (i < processedText.length) {
        // Check for emoji at current position
        const remainingText = processedText.slice(i);
        const emojiMatch = remainingText.match(emojiPattern);
        if (emojiMatch && remainingText.indexOf(emojiMatch[0]) === 0) {
            count += 2; // Emoji count as 2 characters
            i += emojiMatch[0].length;
            continue;
        }
        // Check for CJK characters
        const currentChar = processedText[i];
        if (cjkPattern.test(currentChar)) {
            count += 2; // CJK characters count as 2
        }
        else {
            count += 1; // Regular character counts as 1
        }
        i += 1;
    }
    return count;
}
/**
 * Get the character length of a post according to Meta's (Instagram, Facebook, etc.) counting rules.
 *
 * This implements Meta's character counting logic:
 * - URLs count as their actual character length
 * - Emoji count as 2 characters
 * - CJK characters count as 2 characters
 * - Most other characters count as 1 character
 */
export function getMetaCharacterLength(text) {
    // Normalize to NFC form
    const normalizedText = text.normalize("NFC");
    let count = 0;
    // Regex for emoji detection (simplified version)
    const emojiPattern = /[\u{1F000}-\u{1F9FF}]|[\u{1F000}-\u{1F9FF}][\u200D\uFE0F\u{1F000}-\u{1F9FF}]*/gu;
    // Regex for CJK character ranges
    const cjkPattern = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\uf900-\ufaff]/g;
    let i = 0;
    while (i < normalizedText.length) {
        // Check for emoji at current position
        const remainingText = normalizedText.slice(i);
        const emojiMatch = remainingText.match(emojiPattern);
        if (emojiMatch && remainingText.indexOf(emojiMatch[0]) === 0) {
            count += 2; // Emoji count as 2 characters
            i += emojiMatch[0].length;
            continue;
        }
        // Check for CJK characters
        const currentChar = normalizedText[i];
        if (cjkPattern.test(currentChar)) {
            count += 2; // CJK characters count as 2
        }
        else {
            count += 1; // Regular character counts as 1
        }
        i += 1;
    }
    return count;
}
export function validateTwitterBeforeFoldCharacterLimit(text) {
    const length = getTweetCharacterLength(text);
    if (length > 280) {
        console.error(`Content exceeds the character limit, ${length} characters`);
        return false;
    }
    return true;
}
export function validateMetaBeforeFoldCharacterLimit(text) {
    const length = getMetaCharacterLength(text);
    if (length > 141) {
        console.error(`Content exceeds the character limit, ${length} characters`);
        return false;
    }
    return true;
}
export function validateTiktokBeforeFoldCharacterLimit(text) {
    const length = getMetaCharacterLength(text); // Tiktok uses the same character counting rules as Meta
    if (length > 1000) {
        console.error(`Content exceeds the character limit, ${length} characters`);
        return false;
    }
    return true;
}
export function validateLinkedinBeforeFoldCharacterLimit(text) {
    const length = getMetaCharacterLength(text); // LinkedIn uses the same character counting rules as Meta
    if (length > 210) {
        console.error(`Content exceeds the character limit, ${length} characters`);
        return false;
    }
    // Check for LinkedIn's 3-line limit before the fold
    // Handle different line ending formats (\r\n, \n, \r)
    const lines = text.split(/\r\n|\r|\n/);
    if (lines.length > 3) {
        console.error(`Content exceeds the line limit before fold, ${lines.length} lines (max 3)`);
        return false;
    }
    return true;
}
export function validateYoutubeTitleBeforeFoldCharacterLimit(text) {
    const length = getMetaCharacterLength(text); // YouTube uses the same character counting rules as Meta
    if (length > 70) {
        console.error(`YouTube title exceeds the character limit before fold, ${length} characters (max 70)`);
        return false;
    }
    return true;
}
export function validateYoutubeDescriptionBeforeFoldCharacterLimit(text) {
    const length = getMetaCharacterLength(text); // YouTube uses the same character counting rules as Meta
    if (length > 157) {
        console.error(`YouTube description exceeds the character limit before fold, ${length} characters (max 157)`);
        return false;
    }
    return true;
}
/**
 * Truncate text to fit within the "before fold" limits for each social media platform.
 *
 * Platform limits:
 * - Twitter: 280 characters (using Twitter's counting rules)
 * - Instagram/Facebook: 141 characters (using Meta's counting rules)
 * - TikTok: 1000 characters (using Meta's counting rules)
 * - LinkedIn: 210 characters and 3 lines max (using Meta's counting rules)
 * - YouTube: 70 characters for title, 157 characters for description (using Meta's counting rules)
 */
export function getTextBeforeFold(text, platform, contentType = "post") {
    switch (platform) {
        case "twitter":
            return truncateForTwitter(text);
        case "instagram":
        case "facebook":
            return truncateForGeneric(text, 141);
        case "tiktok":
            return truncateForGeneric(text, 1000);
        case "linkedin":
            return truncateForLinkedIn(text);
        case "youtube":
            if (contentType === "title") {
                return truncateForGeneric(text, 70);
            }
            else if (contentType === "description") {
                return truncateForGeneric(text, 157);
            }
            else {
                // For generic 'post' content type, use description limit as default
                return truncateForGeneric(text, 157);
            }
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
}
/**
 * Truncate text for Twitter's before-fold limit (280 characters)
 */
function truncateForTwitter(text) {
    if (getTweetCharacterLength(text) <= 280) {
        return text;
    }
    // Binary search to find the maximum length that fits within 280 characters
    let start = 0;
    let end = text.length;
    let result = "";
    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const candidate = text.substring(0, mid);
        if (getTweetCharacterLength(candidate) <= 280) {
            result = candidate;
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
    }
    return result;
}
/**
 * Truncate text for Generic platforms without special line limits (Instagram, Facebook, TikTok, LinkedIn, YouTube) but with specified character limit
 */
function truncateForGeneric(text, limit) {
    if (getMetaCharacterLength(text) <= limit) {
        return text;
    }
    // Binary search to find the maximum length that fits within the limit
    let start = 0;
    let end = text.length;
    let result = "";
    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const candidate = text.substring(0, mid);
        if (getMetaCharacterLength(candidate) <= limit) {
            // Meta uses the same character counting rules as Instagram, Facebook, TikTok, LinkedIn, YouTube
            result = candidate;
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
    }
    return result;
}
/**
 * Truncate text for LinkedIn's before-fold limit (210 characters and 3 lines max)
 */
function truncateForLinkedIn(text) {
    // First, handle the line limit
    const lines = text.split(/\r\n|\r|\n/);
    let truncatedByLines = text;
    if (lines.length > 3) {
        truncatedByLines = lines.slice(0, 3).join("\n");
    }
    // Then, handle the character limit
    if (getMetaCharacterLength(truncatedByLines) <= 210) {
        return truncatedByLines;
    }
    // Binary search to find the maximum length that fits within 210 characters
    let start = 0;
    let end = truncatedByLines.length;
    let result = "";
    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const candidate = truncatedByLines.substring(0, mid);
        if (getMetaCharacterLength(candidate) <= 210) {
            result = candidate;
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
    }
    return result;
}
