import type z from "zod";
import {
	type ZodAny,
	type ZodIntersection,
	type ZodLiteral,
	type ZodString,
	ZodType,
	type ZodUnion,
	type ZodUnknown
} from "zod";
import { isSchemaSubset } from "./subset";

function isSchema(schema: unknown): schema is ZodType {
	return (
		typeof schema === "object" && schema !== null && "type" in schema && schema instanceof ZodType
	);
}

export function isStringSchema(schema: unknown): schema is ZodString {
	return isSchema(schema) && schema.type === "string";
}

export function isNumberSchema(schema: unknown): schema is z.ZodNumber {
	return isSchema(schema) && schema.type === "number";
}

export function isBooleanSchema(schema: unknown): schema is z.ZodBoolean {
	return isSchema(schema) && schema.type === "boolean";
}

export function isLiteralSchema(schema: unknown): schema is ZodLiteral {
	return isSchema(schema) && schema.type === "literal";
}

export function isUnionSchema(schema: unknown): schema is ZodUnion {
	return isSchema(schema) && schema.type === "union";
}

export function isStringLiteralSchema(schema: unknown): schema is ZodLiteral<string> {
	return isLiteralSchema(schema) && typeof schema.value === "string";
}

export function isNumberLiteralSchema(schema: unknown): schema is ZodLiteral<number> {
	return isLiteralSchema(schema) && typeof schema.value === "number";
}

export function isBooleanLiteralSchema(schema: unknown): schema is ZodLiteral<boolean> {
	return isLiteralSchema(schema) && typeof schema.value === "boolean";
}

export function getUnionSchemas(schema: ZodUnion): ZodType[] {
	// @ts-expect-error
	return schema.options;
}
export function getIntersectionSchemas(schema: ZodIntersection) {
	return [schema.def.left, schema.def.right] as [ZodType, ZodType];
}

export function isIntersectionSchema(schema: unknown): schema is ZodIntersection {
	return isSchema(schema) && schema.type === "intersection";
}

export function areSelfSubset(schema1: ZodType, schema2: ZodType) {
	return isSchemaSubset(schema1, schema2) && isSchemaSubset(schema2, schema1);
}

export function isWhateverSchema(schema: unknown): schema is ZodAny | ZodUnknown {
	return isSchema(schema) && (schema.type === "any" || schema.type === "unknown");
}
