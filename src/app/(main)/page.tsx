import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { resourceHandler } from "@/lib/resources/builders/handler";
import { ResourceClientPage } from "./cpn/ResourceClientPage";

export default async function Home() {
  const resources = await resourceHandler
    .fetchAll()
    .then((r) => r.map((r) => r.build()));

  return (
    <div className="flex flex-col gap-10">
      <div className="text-4xl w-full justify-center flex font-bold">
        Resources
      </div>
      <Suspense>
        <NuqsAdapter>
          <ResourceClientPage {...{ resources }} />
        </NuqsAdapter>
      </Suspense>
    </div>
  );
}
