import * as allResources from "../list/_";

export type ResourceId = keyof typeof allResources;

class ResourceHandler {
	isValidId(id: string): id is ResourceId {
		return id in allResources;
	}
	async fetch(id: ResourceId) {
		return allResources[id];
	}
	async fetchAll() {
		return Object.values(allResources);
	}
}

export const resourceHandler = new ResourceHandler();
