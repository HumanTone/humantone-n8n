import type { INodeProperties } from 'n8n-workflow';

export const detectParameters: INodeProperties[] = [
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: {
				operation: ['detect'],
			},
		},
		default: '',
		required: true,
		description:
			'Text to score for AI likelihood. Returns a 0-100 score. Free, but limited to 30 calls per day per account.',
		placeholder: 'Paste any text here to check how AI-like it reads...',
	},
];
