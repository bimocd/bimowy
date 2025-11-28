import { NextResponse } from "next/server";

export function ErrorResponse(res: any) {
  return NextResponse.json(formatMessage(res), { status: 400 });
}
export function SuccessResponse(res: any) {
  return NextResponse.json(formatMessage(res), { status: 200 });
}
function formatMessage(message: any) {
  return typeof message === "string" ? { message } : message;
}
