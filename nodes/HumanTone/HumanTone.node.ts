import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';
import HumanToneClient, { HumanToneError } from 'humantone';

import { humanizeParameters } from './descriptions/HumanizeDescription';
import { detectParameters } from './descriptions/DetectDescription';
import { accountParameters } from './descriptions/AccountDescription';
import { PACKAGE_VERSION } from './helpers/version';
import type { AccountOutput, DetectOutput, HumanizeOutput } from './types';

export class HumanTone implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HumanTone',
		name: 'humanTone',
		icon: { light: 'file:HumanTone.svg', dark: 'file:HumanTone.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Humanize AI-generated text and check AI likelihood with HumanTone',
		defaults: {
			name: 'HumanTone',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'humanToneApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				// eslint-disable-next-line @n8n/community-nodes/options-sorted-alphabetically -- order reflects primary use case (Humanize first), not alphabet
				options: [
					{
						name: 'Humanize',
						value: 'humanize',
						description: 'Rewrite AI-generated text to sound more natural',
						action: 'Humanize text',
					},
					{
						name: 'Check AI Likelihood',
						value: 'detect',
						description: 'Score how AI-like text reads (0 to 100)',
						action: 'Check AI likelihood',
					},
					{
						name: 'Get Account',
						value: 'getAccount',
						description: 'Get plan, credit balance, subscription status',
						action: 'Get account info',
					},
				],
				default: 'humanize',
			},
			...humanizeParameters,
			...detectParameters,
			...accountParameters,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials('humanToneApi');
		const apiKey = credentials.apiKey as string;
		const baseUrl = credentials.baseUrl as string;

		const client = new HumanToneClient({
			apiKey,
			baseUrl,
			userAgent: `n8n-nodes-humantone/${PACKAGE_VERSION} (n8n)`,
		});

		const signal = this.getExecutionCancelSignal();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				if (operation === 'humanize') {
					const text = this.getNodeParameter('text', itemIndex) as string;
					const level = this.getNodeParameter('level', itemIndex) as
						| 'standard'
						| 'advanced'
						| 'extreme';
					const outputFormat = this.getNodeParameter('outputFormat', itemIndex) as
						| 'text'
						| 'html'
						| 'markdown';
					const customInstructions = this.getNodeParameter(
						'customInstructions',
						itemIndex,
						'',
					) as string;

					const sdkResult = await client.humanize({
						text,
						level,
						outputFormat,
						...(customInstructions ? { customInstructions } : {}),
						...(signal ? { signal } : {}),
					});

					const output: HumanizeOutput = {
						text: sdkResult.text,
						outputFormat: sdkResult.outputFormat,
						creditsUsed: sdkResult.creditsUsed,
						requestId: sdkResult.requestId ?? null,
					};

					returnData.push({
						json: output as unknown as IDataObject,
						pairedItem: { item: itemIndex },
					});
				} else if (operation === 'detect') {
					const text = this.getNodeParameter('text', itemIndex) as string;

					const sdkResult = await client.detect({
						text,
						...(signal ? { signal } : {}),
					});

					const output: DetectOutput = {
						aiScore: sdkResult.aiScore,
					};

					returnData.push({
						json: output as unknown as IDataObject,
						pairedItem: { item: itemIndex },
					});
				} else if (operation === 'getAccount') {
					const sdkResult = await client.account.get(signal ? { signal } : undefined);

					const output: AccountOutput = {
						plan: {
							id: sdkResult.plan.id,
							name: sdkResult.plan.name,
							maxWords: sdkResult.plan.maxWords,
							monthlyCredits: sdkResult.plan.monthlyCredits,
							apiAccess: sdkResult.plan.apiAccess,
						},
						credits: {
							trial: sdkResult.credits.trial,
							subscription: sdkResult.credits.subscription,
							extra: sdkResult.credits.extra,
							total: sdkResult.credits.total,
						},
						subscription: {
							active: sdkResult.subscription.active,
							expiresAt: sdkResult.subscription.expiresAt,
						},
					};

					returnData.push({
						json: output as unknown as IDataObject,
						pairedItem: { item: itemIndex },
					});
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: { error: message },
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (error instanceof HumanToneError) {
					throw new NodeOperationError(this.getNode(), error.message, {
						itemIndex,
						description: `${error.errorCode ?? 'unknown'} (status ${error.statusCode ?? 'n/a'}, request ${error.requestId ?? 'n/a'})`,
					});
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
			}
		}

		return [returnData];
	}
}
