import type { ZodType } from "zod";
import { NSError } from "./error";
import {
	getIntersectionSchemas,
	getUnionSchemas,
	isBooleanLiteralSchema,
	isBooleanSchema,
	isIntersectionSchema,
	isLiteralSchema,
	isNumberLiteralSchema,
	isNumberSchema,
	isStringLiteralSchema,
	isStringSchema,
	isUnionSchema,
	isWhateverSchema
} from "./subset.util";

/**
 * Checks if the inputSchema can be used wherever the mainSchema is expected.
 * @covers Union, Literal, String, Number, Boolean
 * @author Ali Elbani (ft. Mohammed Ihab Kabiri)
 *
 * @example
 * areCompatible(z.string(), z.string()) // true cuz strings are strings nga
 * areCompatible(z.string(),z.literal("ok")) // true (because "ok" is a string)
 * areCompatible(z.literal("ok"),z.string()) // false (because not all strings are "ok")
 */
export function isSchemaSubset(mainSchema: ZodType, inputSchema: ZodType): boolean {
	// TODO: use ZodType not $ZodType

	if (isWhateverSchema(mainSchema)) return true; // any accepts everything
	if (isWhateverSchema(inputSchema)) return false; // anything is not a subset of anything (except any, but we already checked that)

	if (isUnionSchema(mainSchema)) {
		const mainSchemas = getUnionSchemas(mainSchema);
		return mainSchemas.some((oneOfMainSchema) => isSchemaSubset(oneOfMainSchema, inputSchema));
	}

	if (isUnionSchema(inputSchema)) {
		const inputSchemas = getUnionSchemas(inputSchema);
		return inputSchemas.every((oneOfInputSchema) => isSchemaSubset(mainSchema, oneOfInputSchema));
	}

	if (isIntersectionSchema(mainSchema)) {
		const mainSchemas = getIntersectionSchemas(mainSchema);
		return mainSchemas.every((oneOfMainSchema) => isSchemaSubset(oneOfMainSchema, inputSchema));
	}

	// no recursivity here (hopefully)

	if (isLiteralSchema(mainSchema)) {
		if (isLiteralSchema(inputSchema)) {
			if (mainSchema.value === inputSchema.value) return true;
			return false;
		}
		return false;
	}

	if (isStringSchema(mainSchema)) {
		if (isStringLiteralSchema(inputSchema) || isStringSchema(inputSchema)) return true;
		return false;
	}

	if (isNumberSchema(mainSchema)) {
		if (isNumberLiteralSchema(inputSchema) || isNumberSchema(inputSchema)) return true;
		return false;
	}

	if (isBooleanSchema(mainSchema)) {
		if (isBooleanLiteralSchema(inputSchema) || isBooleanSchema(inputSchema)) return true;
		return false;
	}

	// TODO
	throw new NSError("areCompatible: Unsupported schema types", { mainSchema, inputSchema });
}
