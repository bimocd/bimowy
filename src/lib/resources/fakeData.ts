import type { BaseResourceBuilder } from "./builders/base.ts";

export const fakeResources = [
	{
		id: "base-conversion",
		name: "Base conversion",
		tags: ["arithmetic"],
		type: "exercise",
	},
	{
		id: "intro-to-python",
		name: "Introduction to Python",
		tags: ["python"],
		type: "course",
	},
	{
		id: "trig-circle",
		name: "Trigonometric Circle",
		tags: ["math"],
		type: "tool",
	},
	{
		id: "logic-gates",
		name: "Logic Gates",
		tags: ["logic", "cs"],
		type: "journey",
	},
	{
		id: "oop",
		name: "OOP Quiz",
		tags: ["oop"],
		type: "exercise",
	},
	{
		id: "rot",
		name: "Introduction to Cryptography",
		nicknames: ["Intro to Cryptography"],
		tags: ["crypto"],
		type: "course",
	},
	{
		id: "proof-by-contradiction",
		name: "Proof by Contradiction",
		tags: ["logic"],
		type: "exercise",
	},
	{
		id: "recursion-visualizer",
		name: "Recursion Visualizer",
		tags: ["python"],
		type: "tool",
	},
	{
		id: "hespress-w-morocco",
		name: "How Hespress shows Morocco",
		tags: ["politics"],
		type: "video",
	},
	{
		id: "arith-journey",
		name: "Egyptian multiplication",
		nicknames: [
			"Ancient Egyptian multiplication",
			"Mediation & duplation",
			"Peasant multiplication",
			"Russian multiplication",
			"Ethiopian multiplication",
		],
		tags: ["arithmetic"],
		type: "journey",
	},
	{
		id: "modulo-challenges",
		name: "XOR Operator",
		tags: ["arithmetic", "crypto"],
		type: "exercise",
	},
	{
		id: "space",
		name: "Intro to 3D space",
		tags: ["3D"],
		type: "course",
	},
	{
		beta: true,
		id: "we-all-victims-propaganda",
		name: "We are all victims of propaganda",
		tags: ["politics", "us"],
		type: "journey",
	},
	{
		id: "sig",
		name: "Significant figures",
		tags: ["physics"],
		type: "journey",
	},
] as unknown as ReturnType<BaseResourceBuilder["build"]>[];
