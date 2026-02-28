import z, { type ZodType } from "zod";
import { isSchemaSubset } from "@/ns/subset";
import { $group } from "./util";

type CompareTestCase = [expected: boolean, mainSchema: ZodType, inputSchema: ZodType];

const APPLE = z.literal("apple");
const BANANA = z.literal("banana");
const APPLE_BANANA = z.union([APPLE, BANANA]);
const JUST_STRING = z.string();
const STRING_BANANA = z.union([JUST_STRING, BANANA]);

const LITERAL42 = z.literal(42);
const LITERAL43 = z.literal(43);
const LITERAL0 = z.literal(0);
const JUST_NUMBER = z.number();
const NUMBER_42_43 = z.union([LITERAL42, LITERAL43]);

const TRUE = z.literal(true);
const FALSE = z.literal(false);
const JUST_BOOLEAN = z.boolean();
const TRUE_FALSE = z.union([TRUE, FALSE]);
const INTERSECTION_APPLE_42 = z.intersection(APPLE, LITERAL42);

const combinations = [
	// - 0
	[true, APPLE, APPLE],
	[false, APPLE, BANANA],
	[true, APPLE_BANANA, APPLE],
	[true, APPLE_BANANA, BANANA],
	[false, APPLE_BANANA, JUST_STRING],
	// - 5
	[true, JUST_STRING, APPLE],
	[true, JUST_STRING, STRING_BANANA],
	[false, BANANA, JUST_STRING],
	[true, STRING_BANANA, BANANA],
	[true, STRING_BANANA, STRING_BANANA],
	// - 10
	[true, LITERAL42, LITERAL42],
	[false, LITERAL42, LITERAL43],
	[false, LITERAL42, JUST_NUMBER],
	[true, JUST_NUMBER, LITERAL42],
	[true, JUST_NUMBER, NUMBER_42_43],
	// - 15
	[false, NUMBER_42_43, JUST_NUMBER],
	[true, NUMBER_42_43, LITERAL42],
	[true, NUMBER_42_43, LITERAL43],
	[false, NUMBER_42_43, LITERAL0],
	[true, TRUE, TRUE],
	// - 20
	[false, TRUE, FALSE],
	[false, TRUE, JUST_BOOLEAN],
	[true, JUST_BOOLEAN, TRUE],
	[true, JUST_BOOLEAN, FALSE],
	[true, JUST_BOOLEAN, TRUE_FALSE],
	// - 25
	[false, TRUE_FALSE, JUST_BOOLEAN],
	[true, TRUE_FALSE, TRUE],
	[true, TRUE_FALSE, FALSE],
	[false, TRUE_FALSE, APPLE],
	[false, INTERSECTION_APPLE_42, APPLE],
	// - 30
	[false, INTERSECTION_APPLE_42, LITERAL42]
] satisfies CompareTestCase[];

$group(
	"areCompatible",
	combinations.map(([expected, main, input]) => [expected, () => isSchemaSubset(main, input)])
);
