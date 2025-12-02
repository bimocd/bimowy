"use client";
import { UndoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/cpn/main/button";
import { Spinner } from "@/cpn/ui/spinner";

export function BetaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div
      className={`w-full h-full
  flex flex-col justify-center items-center gap-3`}
    >
      <h1 className="text-5xl font-bold -rotate-1">
        Resource is still being worked on!
      </h1>
      <h2 className="opacity-80 font-light">Be patient...</h2>
      <Button
        className={`font-semibold ${loading && "opacity-50 cursor-wait"}`}
        onClick={() => {
          setLoading(true);
          router.back();
        }}
      >
        {loading ? (
          <Spinner strokeWidth="5px" />
        ) : (
          <UndoIcon strokeWidth="5px" />
        )}{" "}
        Go Back
      </Button>
    </div>
  );
}
