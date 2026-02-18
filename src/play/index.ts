import { prisma } from "@/db";

async function main() {
	console.log(await prisma.resource.findMany());
}

main();
