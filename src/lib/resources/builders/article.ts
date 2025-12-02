import { BaseResourceBuilder, type BaseResourceConfig } from "./base";
import type { BSTUINode } from "./bst/nodes";

type ArticleResourceConfig = Omit<BaseResourceConfig, "type"> & {
  uiPlan: BSTUINode;
};
export class ArticleResourceBuilder extends BaseResourceBuilder {
  public uiPlan!: BSTUINode;
  constructor(config: ArticleResourceConfig) {
    super({ ...config, type: "article" });
  }
}

export type BuiltArticleResource = ReturnType<ArticleResourceBuilder["build"]>;
