"use client";
import { inspect } from "node:util";
import { useEffect, useState } from "react";
import { fetchAPICorrect } from "@/app/api/r/[id]/correct/route";

export default function TestPage() {
	const [text, setText] = useState("____");
	useEffect(() => {
		setText("____");
		fetchAPICorrect("factorial", [3], {
			n: 6,
		}).then((r) => setText(inspect(r, { depth: 3 })));
	}, []);
	return <>{text}</>;
}
