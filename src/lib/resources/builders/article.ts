import { BaseResourceBuilder, type BaseResourceConfig } from "./base";
import { executeBST } from "./bst/execute";
import type { BSTUINode } from "./bst/nodes";
import type { BSTUILayoutNode } from "./bst/nodes/ui";
import { Scope } from "./bst/scope";

type ArticleResourceConfig = Omit<BaseResourceConfig, "type"> & {
  uiPlan: BSTUILayoutNode[];
};
export class ArticleResourceBuilder extends BaseResourceBuilder {
  public uiPlan!: BSTUINode;
  constructor(config: ArticleResourceConfig) {
    super({ ...config, type: "article" });
    Object.assign(this, config);
  }
  generateUI() {
    return executeBST(this.uiPlan, new Scope()) as BSTUINode;
  }
}

export type BuiltArticleResource = ReturnType<ArticleResourceBuilder["build"]>;
