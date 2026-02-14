import type { NextRequest } from "next/server";
import * as z from "zod";
import { ErrorResponse, SuccessResponse } from "@/app/api/helpers";
import {
	ExerciseTemplateResourceBuilder,
	type OptionValues
} from "@/lib/resources/builders/exercise";
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
	const BodySchema = z.object({ options: z.object() });
	const { error, success } = BodySchema.safeParse(body);
	if (!success) return ErrorResponse(error.issues);

	// Validate options
	const optionsValues = body.options as OptionValues;
	const OVIssues = resource.validateOptionValues(optionsValues);
	if (OVIssues.length) return ErrorResponse(OVIssues);

	// Generate resource exercise
	const ex = resource.generateExercise(optionsValues);

	return SuccessResponse(ex);
}

type APIGenerateResponse = ReturnType<ExerciseTemplateResourceBuilder["generateExercise"]>;

export async function fetchAPIGenerate(
	resource_id: string,
	options: OptionValues
): Promise<APIGenerateResponse> {
	return await fetch(`/api/r/${resource_id}/generate`, {
		method: "POST",
		body: JSON.stringify({ options })
	}).then((r) => r.json());
}
