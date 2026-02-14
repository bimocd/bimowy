import type { TagId } from "../tags";
import type { ResourceTypeId } from "../types";

type RequiredBaseResourceConfig = {
	id: string;
	type: ResourceTypeId;
	name: string;
};
type OptionalBaseResourceConfig = {
	description?: string;
	nicknames?: string[];
	beta?: boolean;
	tags?: TagId[];
};

export type BaseResourceConfig = RequiredBaseResourceConfig & OptionalBaseResourceConfig;

export class BaseResourceBuilder {
	public id!: string;
	public type!: ResourceTypeId;
	public name!: string;
	public description!: string;
	public nicknames!: string[];
	public beta!: boolean;
	public tags!: TagId[];
	constructor(config: BaseResourceConfig) {
		Object.assign(this, config);
		this.beta = this.beta || false;
		this.nicknames = this.nicknames || [];
		this.tags = this.tags || [];
	}
	build() {
		return {
			beta: this.beta,
			description: this.description,
			id: this.id,
			name: this.name,
			nicknames: this.nicknames,
			tags: this.tags,
			type: this.type,
		};
	}
}

export type BaseResourceData = ReturnType<BaseResourceBuilder["build"]>;
