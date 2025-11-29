import { BaseResourceBuilder, type BaseResourceConfig } from "./base";
import type { BSTUINode } from "./bst/nodes";

export class ArticleResourceBuilder extends BaseResourceBuilder {
  public uiPlan!: BSTUINode;
  constructor(config: Omit<BaseResourceConfig, "type">) {
    super({ ...config, type: "article" });
  }
}
