"use client";
import { UndoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/cpn/main/button";

export function BetaPage() {
  const router = useRouter();
  return (
    <div
      className={`w-full h-full
  flex flex-col justify-center items-center gap-3`}
    >
      <h1 className="text-5xl font-bold -rotate-1">
        Resource is still being worked on!
      </h1>
      <h2 className="opacity-80 font-light">Be patient...</h2>
      <Button className="font-semibold" onClick={() => router.back()}>
        <UndoIcon strokeWidth="5px" /> Go Back
      </Button>
    </div>
  );
}
