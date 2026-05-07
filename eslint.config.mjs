// Cloud-support disabled because the node depends on the `humantone` npm SDK
// (per BRIEF.md §3.1, §7.6, §16.8 — the integration is a thin wrapper around
// the SDK, not manual HTTP). n8n Cloud's verification rules currently forbid
// community nodes with runtime dependencies; until that policy changes, this
// node targets self-hosted n8n only.
import { configWithoutCloudSupport } from '@n8n/node-cli/eslint';

export default configWithoutCloudSupport;
