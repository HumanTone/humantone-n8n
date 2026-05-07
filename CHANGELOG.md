# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-05-07

### Added

- Initial release of `n8n-nodes-humantone`.
- Three operations on the HumanTone node: Humanize, Check AI Likelihood, Get Account.
- Custom credentials class `HumanToneApi` with API key and base URL fields plus `GET /v1/account` test endpoint.
- AI tool framework support (`usableAsTool: true`) so the node can be connected to n8n's AI Agent node.
- TypeScript output interfaces (`HumanizeOutput`, `DetectOutput`, `AccountOutput`) for downstream autocomplete and AI agent introspection.
- Brand SVG icon shared between node and credentials.
- Internal use of the official [`humantone` npm SDK](https://www.npmjs.com/package/humantone) v0.0.2 for all API calls; no manual HTTP.
- `HumanToneError` mapped to `NodeOperationError` with `errorCode`, `statusCode`, and `requestId` surfaced in the error description.
- Honors `continueOnFail()`; sets `pairedItem` on every output.
- User-Agent on outgoing API requests includes `n8n-nodes-humantone/<version>` (version sourced from `package.json` at build time).
