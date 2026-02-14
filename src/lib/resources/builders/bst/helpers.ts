import { CodeHelpers } from "./nodes/code";
import { FunctionHelpers } from "./nodes/functions";
import { OptionHelpers } from "./nodes/option";
import { UIHelpers } from "./nodes/ui";

export const $ = {
	// UI
	...UIHelpers,
	...CodeHelpers,
	...OptionHelpers,
	...FunctionHelpers,
};
