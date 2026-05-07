export interface HumanizeOutput {
	text: string;
	outputFormat: 'text' | 'html' | 'markdown';
	creditsUsed: number;
	requestId: string | null;
}

export interface DetectOutput {
	aiScore: number;
}

export interface AccountOutput {
	plan: {
		id: string;
		name: string;
		maxWords: number;
		monthlyCredits: number;
		apiAccess: boolean;
	};
	credits: {
		trial: number;
		subscription: number;
		extra: number;
		total: number;
	};
	subscription: {
		active: boolean;
		expiresAt: string | null;
	};
}
