import type { INodeProperties } from 'n8n-workflow';

export const humanizeParameters: INodeProperties[] = [
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: {
				operation: ['humanize'],
			},
		},
		default: '',
		required: true,
		description:
			'The AI-generated text to rewrite. Must be at least 30 words. Maximum words per request depend on your plan: 750 (Basic), 1000 (Standard), 1500 (Pro).',
		placeholder: 'Paste your AI-generated text here to make it sound more natural...',
	},
	{
		displayName: 'Humanization Level',
		name: 'level',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['humanize'],
			},
		},
		options: [
			{
				name: 'Standard (Recommended)',
				value: 'standard',
				description: 'Highest-quality natural rewrites. Supports 60+ languages.',
			},
			{
				name: 'Advanced',
				value: 'advanced',
				description: 'Stronger reduction of AI patterns. English only.',
			},
			{
				name: 'Extreme',
				value: 'extreme',
				description: 'Maximum AI-pattern reduction. English only. May reduce output quality.',
			},
		],
		default: 'standard',
		description:
			'How aggressively to rewrite. Standard works for most cases. Advanced and Extreme are English-only.',
	},
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['humanize'],
			},
		},
		options: [
			{ name: 'Plain Text', value: 'text' },
			{ name: 'HTML', value: 'html' },
			{ name: 'Markdown', value: 'markdown' },
		],
		default: 'text',
		description:
			'Format of the returned text. Default: plain text. Use HTML or Markdown if publishing directly to a CMS.',
	},
	{
		displayName: 'Custom Instructions',
		name: 'customInstructions',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				operation: ['humanize'],
			},
		},
		default: '',
		description:
			'Optional. Free-form guidance for the rewrite: tone, audience, terminology to preserve, brand voice. Maximum 1000 characters.',
		placeholder:
			'E.g., Keep a friendly tone, preserve brand names, simplify technical jargon, etc.',
	},
];
