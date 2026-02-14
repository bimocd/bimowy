import type { NextRequest } from "next/server";
import * as z from "zod";
import { ErrorResponse, SuccessResponse } from "@/app/api/helpers";
import { ExerciseTemplateResourceBuilder } from "@/lib/resources/builders/exercise";
import { resourceHandler } from "@/lib/resources/builders/handler";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	// Check if [id] is valid
	if (!resourceHandler.isValidId(id)) return ErrorResponse(`No resource found for "${id}"`);
	const resource = await resourceHandler.fetch(id);
	if (!(resource instanceof ExerciseTemplateResourceBuilder))
		return ErrorResponse(`Resource "${id}" is not an exercise.`);

	// Check for request body
	const body = await req.json().catch(() => 0);
	if (!body) return ErrorResponse("No request body.");

	// Validate request body
	const BodySchema = z.object({
		seed: z.any(),
		inputValues: z.record(z.string(), z.any())
	});
	const { error, success } = BodySchema.safeParse(body);
	if (!success) return ErrorResponse(error.issues);

	// Validate options
	const { seed, inputValues } = body;
	const seedIssues = resource.validateSeed(seed);
	if (seedIssues.length) return ErrorResponse(seedIssues);

	// Generate resource exercise
	const ex = resource.correct(body.seed, inputValues);

	return SuccessResponse(ex);
}

type APICorrectResponse = ReturnType<ExerciseTemplateResourceBuilder["correct"]>;

export async function fetchAPICorrect(
	resource_id: string,
	seed: any,
	inputValues: Record<string, any> // TODO more specific record values
): Promise<APICorrectResponse> {
	return await fetch(`/api/r/${resource_id}/correct`, {
		method: "POST",
		body: JSON.stringify({ seed, inputValues })
	}).then((r) => r.json());
}
