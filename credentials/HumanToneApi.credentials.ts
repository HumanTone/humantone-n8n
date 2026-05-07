import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HumanToneApi implements ICredentialType {
	name = 'humanToneApi';
	displayName = 'HumanTone API';
	documentationUrl = 'https://humantone.io/docs/api/';
	icon = { light: 'file:HumanTone.svg', dark: 'file:HumanTone.dark.svg' } as const;

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your HumanTone API key. Generate one at https://app.humantone.io/settings/api. Format: ht_ followed by 64 hex characters.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.humantone.io',
			description:
				'Override only if testing against a staging environment. Leave default for production.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/account',
			method: 'GET',
		},
	};
}
