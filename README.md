# 🎯 Vibe Marketing MCP
![Test and Deploy](https://github.com/synthetic-ci/vibe-marketing/actions/workflows/deploy.yml/badge.svg)
[![Tests](https://img.shields.io/badge/tests-181%20passing-brightgreen)](https://github.com/normand1/vibe-marketing/tree/main/src)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A **Model Context Protocol (MCP) server** designed for AI-powered marketing and social media content creation. This Cloudflare Worker-based service provides tools, templates, and frameworks to help create engaging content across multiple social media platforms.

![Vibe Marketing Logo](readme-assets/vibe-marketing-logo.jpeg)
![Vibe Marketing Demo](readme-assets/trending.gif)

## 📖 Usage Examples


## ✨ Features

### 🔍 Social Media Hook Discovery
- **Find hooks by network**: Get platform-specific hooks for Twitter, Instagram, LinkedIn, TikTok, YouTube, and Facebook
- **Category-based search**: Find hooks by engagement type (educational, promotional, storytelling, etc.)
- **Smart filtering**: Limit results and find the most relevant hooks for your content

### 📝 Copywriting Frameworks
- **Platform-specific frameworks**: Tailored copywriting templates for each social media platform
- **Multiple frameworks per platform**: Choose from various proven copywriting structures
- **Brand archetype integration**: Align your content with specific brand personalities

### 🎭 KOL Archetypes
- **12+ KOL archetypes**: From "The Hero" to "The Sage" - find the perfect KOL voice
- **Detailed descriptions**: Comprehensive archetype profiles with characteristics and messaging guidelines
- **Content alignment**: Ensure your copy matches your personality

### 🚫 Content Validation
- **Problematic phrase detection**: Automatically flag potentially problematic language
- **Above-the-fold optimization**: Validate and optimize your opening content
- **Content length management**: Get properly truncated text that maintains impact

### 📈 Trending Content Discovery
- **Real-time trends**: Access trending topics and content ideas
- **Platform-specific trends**: Get trends tailored to specific social media networks
- **Content inspiration**: Generate ideas based on what's currently popular

## 🚀 Quick Start


**Manual deployment** is also available via the "Actions" tab in your GitHub repository.

## 🛠️ Available Tools

### Hook Discovery
- `find-hooks` - Search for social media hooks by network and category
- `get-network-categories-for-hooks` - Get available hook categories for specific networks

### Copywriting
- `list-copywriting-frameworks-for-network` - List available frameworks for a platform
- `get-copywriting-framework` - Get detailed copywriting framework template

### Brand Management  
- `list-archetypes` - List all available brand archetypes
- `get-archetype` - Get detailed information about a specific archetype

### Content Validation
- `flag-problematic-phrases` - Detect potentially problematic language in content
- `validate-content-before-fold` - Validate above-the-fold content effectiveness
- `get-text-before-fold` - Get optimally truncated content for previews

### Trending Content
- `get-trending-content` - Access current trending topics and content ideas

## 📚 Resources

The MCP server provides access to curated resources:

- **Social Media Hooks**: Database of proven hooks categorized by platform and engagement type
- **Phrases to Avoid**: List of potentially problematic phrases to avoid in marketing content

## 🎯 Supported Platforms

- **Twitter/X** - Optimized for short-form, viral content
- **Instagram** - Visual-first content with engaging captions  
- **LinkedIn** - Professional, business-focused content
- **TikTok** - Trend-driven, entertainment-focused content
- **YouTube** - Long-form, educational content optimization
- **Facebook** - Community-building and engagement-focused content


# Contributing Dev Updates

### Prerequisites
- Node.js 18+  
- pnpm package manager
- Cloudflare account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/vibe-marketing-mcp.git
   cd vibe-marketing-mcp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Development**
   ```bash
   # Start development server
   pnpm dev
   
   # Run tests
   pnpm test
   
   # Type checking
   pnpm type-check
   ```

4. **Deploy to Cloudflare Workers**
   ```bash
   pnpm deploy
   ```

## 🚀 Automated Deployment

This project includes GitHub Actions for automatic deployment to Cloudflare Workers when PRs are merged to the `main` branch.

### Setup GitHub Secrets

To enable automatic deployment, add the following secrets to your GitHub repository:

1. Go to your repository settings → Secrets and variables → Actions
2. Add the following repository secrets:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token with Workers deployment permissions | [Create API Token](https://dash.cloudflare.com/profile/api-tokens) with "Custom token" → Permissions: `Zone:Zone:Read`, `Account:Cloudflare Workers:Edit` |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | Found in the right sidebar of your [Cloudflare dashboard](https://dash.cloudflare.com/) |

### Deployment Workflow

The GitHub Action will automatically:
- ✅ Run tests
- 🔧 Install dependencies  
- 🚀 Deploy to Cloudflare Workers

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once
pnpm test:run
```

## 🛡️ Code Quality

This project uses Biome for linting and formatting:

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## 📁 Project Structure

```
src/
├── content/          # Content templates and data
│   ├── copywriting/  # Platform-specific copywriting frameworks
│   ├── hooks/        # Social media hooks database
│   ├── humanizing/   # Content humanization rules
│   └── voicing/      # Brand archetype definitions
├── formatters/       # Data formatting utilities
├── prompts/          # AI prompt templates
├── resources/        # MCP resources (hooks, phrases to avoid)
├── services/         # Business logic services
├── tools/            # MCP tool implementations
└── types/            # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Model Context Protocol](https://github.com/modelcontextprotocol) - The protocol this server implements
- [Cloudflare Workers](https://workers.cloudflare.com/) - The serverless platform powering this service

## 📧 Support

If you have questions or need help:

1. Check the [Issues](https://github.com/<your-username>/vibe-marketing-mcp/issues) page
2. Create a new issue if your question isn't answered
3. For urgent matters, reach out to the maintainers

---

**Built with ❤️ for creators, by HyperFeed.ai**

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://davescommute.blog/"><img src="https://avatars.githubusercontent.com/u/1393261?v=4?s=100" width="100px;" alt="David Norman"/><br /><sub><b>David Norman</b></sub></a><br /><a href="https://github.com/normand1/Vibe Marketing MCP/commits?author=normand1" title="Code">💻</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!