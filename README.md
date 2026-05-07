# n8n-nodes-humantone

Official [n8n](https://n8n.io) community node for [HumanTone](https://humantone.io). Humanize AI-generated text and check AI likelihood directly in your n8n workflows.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-humantone.svg)](https://www.npmjs.com/package/n8n-nodes-humantone)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

In your n8n instance:

1. Open **Settings → Community Nodes**
2. Click **Install**
3. Enter: `n8n-nodes-humantone`
4. Click **Install** and wait for completion
5. The HumanTone node will appear in your node list under "Transform"

## Setup

1. Get an API key at [app.humantone.io/settings/api](https://app.humantone.io/settings/api). Requires a paid HumanTone plan; free trial accounts cannot use the API.
2. In n8n, when you add a HumanTone node, click **Create New Credential**.
3. Paste your API key. Click **Test** to verify. Save.

## Operations

### Humanize

Rewrite AI-generated text to sound more natural.

Inputs:
- **Text** (required, min 30 words)
- **Humanization Level**: Standard, Advanced, or Extreme. Standard works for most cases. Advanced and Extreme are English-only.
- **Output Format**: Plain Text, HTML, or Markdown.
- **Custom Instructions** (optional, max 1,000 chars): free-form guidance for tone, terminology, audience.

Output: humanized text plus credits used and request ID.

### Check AI Likelihood

Score how AI-like text reads (0 to 100). Higher means more AI patterns detected.

Inputs:
- **Text** (required)

Output: `aiScore` (integer 0-100).

Free, but limited to 30 checks per day per account (shared between web app and API).

### Get Account

Returns your plan, credit balance, and subscription status. Useful for checking remaining credits before a large batch.

Output: `plan`, `credits`, `subscription` objects.

## Workflow Examples

### Example 1: AI text generation, humanized before publishing

The primary use case. Generate text with any AI node, then humanize before sending to your CMS, Notion, Slack, email, etc.

```
Trigger → OpenAI / Anthropic / any AI node → HumanTone (Humanize) → Notion / CMS / Slack
```

In the HumanTone node, set Text to the AI node's output, e.g. `{{$json.message.content}}`. Pick Level: Standard for most cases.

### Example 2: AI Agent with HumanTone as a tool

n8n's AI Agent node can use HumanTone operations as agent tools. Connect HumanTone to your agent and it can call humanize as a tool when generating text.

```
Trigger → AI Agent (with HumanTone connected as a tool)
```

### Example 3: Pre-batch credit check

Before processing a batch of articles, check credit balance to avoid mid-batch failures.

```
Manual Trigger → HumanTone (Get Account) → IF (credits < 200) → Stop & Notify
```

## Configuration

The HumanTone credentials only need an API key. The base URL field defaults to `https://api.humantone.io` and only needs to change for staging or testing.

The node uses the official [`humantone` npm SDK](https://www.npmjs.com/package/humantone) under the hood. Retry policy comes from the SDK: GET (account) retries on 5xx and 429. POST (humanize, detect) does not retry on 5xx by default to avoid duplicate side effects (humanize consumes credits, detect consumes daily AI likelihood quota).

## Limits to remember

- **Per-request word limit.** Basic 750, Standard 1,000, Pro 1,500. Inputs must be at least 30 words.
- **Credits.** Humanize consumes 1 credit per 100 words. Detect and Get Account do not consume credits.
- **AI likelihood quota.** 30 checks per day per account, shared between the HumanTone web app and any API or SDK usage.
- **API access.** Included on all paid plans. Free trial accounts cannot use the API.

## Compatibility

Self-hosted n8n. Tested on n8n 1.50+. Requires Node.js 20 or later.

## License

MIT

## Links

- API docs: https://humantone.io/docs/api/
- npm: https://www.npmjs.com/package/n8n-nodes-humantone
- n8n SDK (used internally): https://www.npmjs.com/package/humantone
- Issues: https://github.com/HumanTone/humantone-n8n/issues
- Support: help@humantone.io
