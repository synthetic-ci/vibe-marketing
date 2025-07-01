export class HookSearchService {
    hooksData;
    constructor(hooksData) {
        this.hooksData = hooksData;
    }
    searchHooks(filters) {
        const { network, category, limit = 10 } = filters;
        let results = [];
        // If specific network is requested
        if (network && this.hooksData.networks[network]) {
            const networkData = this.hooksData.networks[network];
            // If specific category is also requested
            if (category && networkData.categories[category]) {
                const hooks = networkData.categories[category].hooks || [];
                results = hooks.map((hook) => ({
                    network: networkData.name || network,
                    category: networkData.categories[category].name || category,
                    hook,
                }));
            }
            else {
                // Return all categories for the network
                Object.entries(networkData.categories).forEach(([catKey, catData]) => {
                    const hooks = catData.hooks || [];
                    hooks.forEach((hook) => {
                        results.push({
                            network: networkData.name || network,
                            category: catData.name || catKey,
                            hook,
                        });
                    });
                });
            }
        }
        else if (category && !network) {
            // Search across all networks for the specific category
            Object.entries(this.hooksData.networks).forEach(([netKey, netData]) => {
                if (netData.categories[category]) {
                    const hooks = netData.categories[category].hooks || [];
                    hooks.forEach((hook) => {
                        results.push({
                            network: netData.name || netKey,
                            category: netData.categories[category].name || category,
                            hook,
                        });
                    });
                }
            });
        }
        else {
            // Return all hooks if no filters specified
            Object.entries(this.hooksData.networks).forEach(([netKey, netData]) => {
                Object.entries(netData.categories).forEach(([catKey, catData]) => {
                    const hooks = catData.hooks || [];
                    hooks.forEach((hook) => {
                        results.push({
                            network: netData.name || netKey,
                            category: catData.name || catKey,
                            hook,
                        });
                    });
                });
            });
        }
        // Apply limit with randomization if needed
        if (results.length > limit) {
            // Shuffle results before applying limit
            const shuffled = [...results];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled.slice(0, limit);
        }
        return results.slice(0, limit);
    }
    formatResults(results) {
        if (results.length === 0) {
            return "No hooks found matching your criteria.";
        }
        let responseText = `Found ${results.length} hook(s):\n\n`;
        results.forEach((result, index) => {
            responseText += `${index + 1}. **${result.network} - ${result.category}**\n`;
            responseText += `   "${result.hook}"\n\n`;
        });
        // Add usage tips from YAML data
        if (this.hooksData.usage_tips &&
            Object.keys(this.hooksData.usage_tips).length > 0) {
            responseText += "\n💡 **Usage Tips:**\n";
            Object.values(this.hooksData.usage_tips).forEach((tip) => {
                responseText += `• ${tip}\n`;
            });
        }
        return responseText;
    }
}
