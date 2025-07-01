export interface CopywritingComponent {
	name: string;
	purpose: string;
	format: string;
	examples: string[];
	note: string;
}

export interface CopywritingFramework {
	title: string;
	components: CopywritingComponent[];
}

export interface NetworkCopywriting {
	name: string;
	aida?: CopywritingFramework;
	pas?: CopywritingFramework;
	bab?: CopywritingFramework;
	"4cs"?: CopywritingFramework;
	uuuu?: CopywritingFramework;
	pppp?: CopywritingFramework;
	slap?: CopywritingFramework;
	app?: CopywritingFramework;
	storybrand?: CopywritingFramework;
	formatting_checklist?: string[];
}

export interface CopywritingData {
	[networkKey: string]: NetworkCopywriting;
}

export interface GeneralRules {
	general_rules: string[];
}
